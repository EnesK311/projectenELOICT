import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Alert } from "react-native";
import MatchCard from "../molecules/matchcard";
import TitleMain from "../atoms/titlemain";
import { useGetRecentResultsQuery } from "@/api/apiSlice";
import { Division, Match, Region } from "../../types/types";

type RecentGamesProps = {
  selectedRegion: Region | null;
  selectedDivision: Division | null;
  setRefetchMatchesFunc: React.Dispatch<
    React.SetStateAction<(() => Promise<any>) | null>
  >;
};

function RecentGames({
  selectedRegion,
  selectedDivision,
  setRefetchMatchesFunc,
}: RecentGamesProps) {
  const [matches, setMatches] = useState<Match[]>([]);

  // Fetch recent matches for the selected division
  // Make sure your API accepts the division ID similarly to "useGetDivisionResultsQuery"
  const {
    data: fetchedMatches,
    isLoading,
    error,
    refetch: refetchMatches,
  } = useGetRecentResultsQuery(
    selectedDivision ? { id: selectedDivision.id } : { id: 0 },
    {
      skip: !selectedDivision,
    }
  );

  // Provide refetch function back up to HomeScreen
  useEffect(() => {
    setRefetchMatchesFunc(() => refetchMatches);
  }, [refetchMatches, setRefetchMatchesFunc]);

  // Update local matches state
  useEffect(() => {
    if (fetchedMatches) {
      setMatches(fetchedMatches);
    }
  }, [fetchedMatches]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert(
        "Error",
        `Failed to fetch recent matches: ${error.toString()}`
      );
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <TitleMain title="Recente Wedstrijden" />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>Error: {error.toString()}</Text>}

      {!isLoading && !error && matches.length === 0 && (
        <Text>No matches played recently.</Text>
      )}

      {!isLoading &&
        !error &&
        matches.map((match) => (
          <MatchCard key={match.id} id={match.id} match={match} />
        ))}
    </View>
  );
}

export default RecentGames;

const styles = StyleSheet.create({
  container: {},
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
