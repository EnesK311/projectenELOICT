import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import TeamAtom from "../atoms/teamAtom";

type Match = {
  id: number;
  planned_at?: string;
  status?: number;
  score1?: number;
  score2?: number;
  team1?: {
    id: number;
    name: string;
    last5Record?: any[];
  };
  team2?: {
    id: number;
    name: string;
    last5Record?: any[];
  };
};

type MatchCardProps = {
  id: number;
  match: Match;
};

function MatchCard({ match }: MatchCardProps) {
  const handlePress = () => {
    router.push({
      pathname: "/matchdetails",
      params: { match: JSON.stringify(match) },
    });
  };

  if (!match) {
    return <Text>Match data not available.</Text>;
  }

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <View style={styles.container}>
        {/* Conditional rendering for date/time or score */}
        {match.status !== 2 ? (
          <View style={styles.dateContainer}>
            <Text style={styles.date}>
              {match.planned_at &&
                new Date(match.planned_at).toLocaleDateString("nl-BE", {
                  day: "2-digit",
                  month: "short",
                })}
            </Text>
            <Text style={styles.time}>
              {match.planned_at &&
                new Date(match.planned_at).toLocaleTimeString("nl-BE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Text>
          </View>
        ) : (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {match.score1} - {match.score2}
            </Text>
          </View>
        )}

        {/* Teams */}
        <View style={styles.teamsContainer}>
          <View style={styles.teamAtomContainer}>
            <TeamAtom
              teamId={match.team1?.id || 0}
              name={match.team1?.name || "Unknown"}
              matches={match.team1?.last5Record || []}
            />
          </View>
          <View style={styles.teamAtomContainer}>
            <TeamAtom
              teamId={match.team2?.id || 0}
              name={match.team2?.name || "Unknown"}
              matches={match.team2?.last5Record || []}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default MatchCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  dateContainer: {
    marginRight: 16,
    alignItems: "flex-start",
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 14,
    color: "#777",
  },
  teamsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamAtomContainer: {
    flex: 1,
    alignItems: "center",
  },
  scoreContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
