import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Alert } from "react-native";
import MatchCard from "../molecules/matchcard";
import TitleMain from "../atoms/titlemain";
import { useGetDivisionResultsQuery } from "@/api/apiSlice";
import { Division, Match, Region } from "../../types/types";

type UpcomingGamesProps = {
  selectedRegion: Region | null;
  selectedDivision: Division | null;
  // Pass down a setter so we can provide the refetch function to the parent
  setRefetchMatchesFunc: React.Dispatch<
    React.SetStateAction<(() => Promise<any>) | null>
  >;
};

function UpcomingGames({
  selectedRegion,
  selectedDivision,
  setRefetchMatchesFunc,
}: UpcomingGamesProps) {
  const [matches, setMatches] = useState<Match[]>([]);

  // Fetch upcoming matches for the selected division
  const {
    data: fetchedMatches,
    isLoading,
    error,
    refetch: refetchMatches,
  } = useGetDivisionResultsQuery(selectedDivision?.id || 0, {
    skip: !selectedDivision, // Skip if no division is selected
  });

  // Whenever refetchMatches changes, pass it back up to HomeScreen
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
      Alert.alert("Error", `Failed to fetch matches: ${error.toString()}`);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <TitleMain title="Komende Wedstrijden" />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>Error: {error.toString()}</Text>}

      {!isLoading && !error && matches.length === 0 && (
        <Text>No upcoming matches found for this division.</Text>
      )}

      {!isLoading &&
        !error &&
        matches.map((match) => (
          <MatchCard key={match.id} id={match.id} match={match} />
        ))}
    </View>
  );
}

export default UpcomingGames;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
