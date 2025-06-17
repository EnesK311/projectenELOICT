// src/components/statistics/StatisticsContent.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Header from "@/components/atoms/blueheader";
import StatSquare from "@/components/atoms/statsquare";
import { useRouter } from "expo-router";

interface StatisticsContentProps {
  isLoading: boolean;
  error: unknown;
  data:
    | {
        name?: string;
        players?: Array<any>;
        next_game?: any;
        next_game_opponent?: string;
        win_loss_record?: string[];
        position?: number;
      }
    | undefined;
}

const StatisticsContent: React.FC<StatisticsContentProps> = ({
  isLoading,
  error,
  data,
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1A2B47" />
        <Text>Loading statistics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>
          Failed to load team statistics. Please try again.
        </Text>
      </View>
    );
  }

  // 3. No Data
  if (!data) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>No data available.</Text>
      </View>
    );
  }

  // 4. Destructure the returned data
  const {
    name,
    players,
    next_game,
    next_game_opponent,
    win_loss_record,
    position,
  } = data;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with team name and W/L record */}
        <Header
          title={name || "Team Statistics"}
          winLossRecord={win_loss_record || []}
        />

        {/* Stat squares (Next Game & Position) */}
        <View style={styles.statsRow}>
          <StatSquare
            value={next_game_opponent || "N/A"}
            label="Next game"
            sublabel={
              next_game?.planned_at
                ? new Date(next_game.planned_at).toLocaleDateString()
                : "TBD"
            }
            onPress={() =>
              router.push({
                pathname: "/matchdetails",
                params: { match: JSON.stringify(next_game) },
              })
            }
          />

          <StatSquare
            value={`${position || "N/A"}`}
            label="League position"
            onPress={() =>
              router.push({
                pathname: "/division",
                params: { id: next_game?.division_id },
              })
            }
          />
        </View>

        {/* Squad list */}
        <View style={styles.squadContainer}>
          <Text style={styles.squadTitle}>Squad list</Text>
          <View style={styles.squadTableHeader}>
            <Text style={styles.tableHeaderCell}>Nr.</Text>
            <Text style={styles.tableHeaderCell}>Player Name</Text>
            <Text style={styles.tableHeaderCell}>MP</Text>
            <Text style={styles.tableHeaderCell}>Goals</Text>
            <Text style={styles.tableHeaderCell}>Assists</Text>
          </View>
          <ScrollView style={styles.scrollView}>
            {players?.map((player: any) => (
              <View key={player.id?.toString()} style={styles.tableRow}>
                <Text style={styles.tableCell}>{player.number}</Text>
                <Text style={[styles.tableCell, styles.nameCell]}>
                  {`${player.first_name} ${player.last_name}`}
                </Text>
                <Text style={styles.tableCell}>{player.games || 0}</Text>
                <Text style={styles.tableCell}>{player.goals || 0}</Text>
                <Text style={styles.tableCell}>{player.assists || 0}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatisticsContent;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 15,
  },
  squadContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  squadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  squadTableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  scrollView: {
    flex: 1,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
  },
  nameCell: {
    textAlign: "left",
    paddingLeft: 10,
  },
});
