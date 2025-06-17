import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "@/components/atoms/button";
import {
  initializePusher,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "@/contexts/PusherContext";
import { useUpdateMatchScoreMutation } from "@/api/apiSlice";

type ManageScoresScreenProps = {
  match: any;
  onStopEditing: () => void;
};

export default function ManageScoresScreen({
  match,
  onStopEditing,
}: ManageScoresScreenProps) {
  const [scores, setScores] = useState({
    team1: match.score1,
    team2: match.score2,
  });

  const [updateMatchScore] = useUpdateMatchScoreMutation();

  useEffect(() => {
    initializePusher();

    const handleScoreUpdate = (event: any) => {
      console.log("Raw event data:", event);
      const eventData = JSON.parse(event.data);
      console.log("Parsed event data:", eventData);

      if (event.eventName === "App\\Events\\ScoreUpdated") {
        setScores({
          team1: eventData.homeTeamScore,
          team2: eventData.awayTeamScore,
        });
      }
    };

    const channelName = `match-${match.id}`;
    subscribeToChannel(channelName, handleScoreUpdate);
    console.log(`Subscribed to channel: ${channelName}`);

    // Cleanup function to unsubscribe on unmount
    return () => {
      unsubscribeFromChannel(channelName);
      console.log(`Unsubscribed from channel: ${channelName}`);
    };
  }, [match.id]);

  const handleChangeScore = async (team: "team1" | "team2", delta: number) => {
    const updatedScores = {
      ...scores,
      [team]: Math.max(0, scores[team] + delta),
    };

    setScores(updatedScores); // Optimistically update the score

    try {
      const response = await updateMatchScore({
        matchId: match.id,
        home_team_score: updatedScores.team1,
        away_team_score: updatedScores.team2,
      }).unwrap();

      // Ensure the response updates the scores
      setScores({
        team1: response.home_team_score,
        team2: response.away_team_score,
      });
    } catch (error) {
      console.error("Error updating the score:", error);
      Alert.alert("Error", "Failed to update the score.");
      setScores(scores); // Revert to previous scores on failure
    }
  };

  const handleFinishMatch = () => {
    Alert.alert(
      "Finish Match",
      "Are you sure you want to finish the match?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Finish",
          onPress: () => console.log("Finish Match pressed"),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.liveScoreContainer}>
        <View style={[styles.teamSection, { backgroundColor: "#ccffcc" }]}>
          <Text style={styles.teamName}>{match.team1.name}</Text>
          <View style={styles.scoreControls}>
            <Button title="+" onPress={() => handleChangeScore("team1", 1)} />
            <Text style={styles.score}>{scores.team1}</Text>
            <Button title="-" onPress={() => handleChangeScore("team1", -1)} />
          </View>
        </View>
        <View style={[styles.teamSection, { backgroundColor: "#cce5ff" }]}>
          <Text style={styles.teamName}>{match.team2.name}</Text>
          <View style={styles.scoreControls}>
            <Button title="+" onPress={() => handleChangeScore("team2", 1)} />
            <Text style={styles.score}>{scores.team2}</Text>
            <Button title="-" onPress={() => handleChangeScore("team2", -1)} />
          </View>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <Button title="Stop Managing" onPress={onStopEditing} />
        <Button title="Finish Match" onPress={handleFinishMatch} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  liveScoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  teamSection: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
  },
  teamName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreControls: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  actionsContainer: {
    marginTop: 20,
  },
});
