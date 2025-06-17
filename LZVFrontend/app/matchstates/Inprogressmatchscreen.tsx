import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components/atoms/button";
import TeamAtom from "@/components/atoms/teamAtom";
import {
  initializePusher,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "@/contexts/PusherContext";
import { MatchImageAtom } from "@/components/atoms/matchimageatom";

type InProgressProps = {
  match: any;
  isLoggedIn: boolean;
  onManageScores: () => void;
};

export default function InProgressMatchScreen({
  match,
  isLoggedIn,
  onManageScores,
}: InProgressProps) {
  const [scores, setScores] = useState({
    team1: match.score1,
    team2: match.score2,
  });

  useEffect(() => {
    initializePusher();

    const handleScoreUpdate = (event: any) => {
      const eventData = JSON.parse(event.data);
      if (event.eventName === "App\\Events\\ScoreUpdated") {
        setScores({
          team1: eventData.homeTeamScore,
          team2: eventData.awayTeamScore,
        });
      }
    };

    subscribeToChannel(`match-${match.id}`, handleScoreUpdate);

    return () => {
      unsubscribeFromChannel(`match-${match.id}`);
    };
  }, [match.id]);

  return (
    <View style={styles.container}>
      {/* Match location */}
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>{match.location.name}</Text>
      </View>

      {/* Teams and live score */}
      <View style={styles.teamsContainer}>
        <TeamAtom
          name={match.team1.name}
          matches={match.team1.last5Record}
          teamId={match.team1.id}
        />
        <TeamAtom
          name={match.team2.name}
          matches={match.team2.last5Record}
          teamId={match.team2.id}
        />
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.liveScore}>
          {scores.team1} - {scores.team2}
        </Text>
        <Text style={styles.liveLabel}>Live</Text>
      </View>

      {/* Divider */}
      <View style={styles.blueline}></View>

      {/* Actions */}
      {isLoggedIn && (
        <>
          <Button title="Manage Live Scores" onPress={onManageScores} />
          <MatchImageAtom matchId={match.id} isLoggedIn={isLoggedIn} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  locationContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20,
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveScore: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
  liveLabel: {
    fontSize: 14,
    color: "#ff0000",
    fontWeight: "bold",
    marginTop: 5,
  },
  blueline: {
    height: 4,
    backgroundColor: "#0000ff",
    marginVertical: 20,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
  },
});
