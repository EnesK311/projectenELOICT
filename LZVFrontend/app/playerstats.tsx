import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useGetPlayerStatsQuery } from "../api/apiSlice";
import { Button } from "@/components/atoms/button";

const PlayerStats = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user logged in.</Text>
      </View>
    );
  }

  // Use the query hook to fetch player stats
  const { data: stats, isLoading, error } = useGetPlayerStatsQuery(user.id);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    Alert.alert("Error", "Failed to fetch player stats");
    return (
      <View style={styles.container}>
        <Text>Error loading stats</Text>
        <Button
          title="Logout"
          onPress={() => {
            // Add your logout logic here
            Alert.alert("Logged out", "You have been logged out successfully.");
          }}
        />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text>No stats available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.role}>Player</Text>
        <Text style={styles.name}>{user.email}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.goals_scored}</Text>
          <Text style={styles.statLabel}>Goals scored</Text>
          <Text style={styles.statSubLabel}>{stats.goals_rank} of League</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.assists_given}</Text>
          <Text style={styles.statLabel}>Assists given</Text>
          <Text style={styles.statSubLabel}>
            {stats.assists_rank} of League
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.matches_played}</Text>
          <Text style={styles.statLabel}>Matches played</Text>
          <Text style={styles.statSubLabel}>
            {stats.matches_total} games played
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PlayerStats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  role: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "45%",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel: {
    fontSize: 16,
    color: "#666",
  },
  statSubLabel: {
    fontSize: 12,
    color: "#999",
  },
});
