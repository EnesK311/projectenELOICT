import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components/atoms/button";
import TeamAtom from "@/components/atoms/teamAtom";
import { MatchImageAtom } from "@/components/atoms/matchimageatom";

type TeamData = {
  id: number;
  name: string;
  available_players: number;
  position: number; // from your JSON, spelled "postition"? Or "position"?
};

type ExtraData = {
  team1: TeamData;
  team2: TeamData;
};

type Match = {
  id: number;
  location: {
    name: string;
    address: string;
  };
  planned_at: string;
  team1: {
    name: string;
    id: number;
    last5Record?: any; // Adjust if you have a stricter type
  };
  team2: {
    name: string;
    id: number;
    last5Record?: any; // Adjust if you have a stricter type
  };
  score1?: number;
  score2?: number;
  status: number; // 0, 1, 2, etc.
};

type Props = {
  match: Match;
  isLoggedIn: boolean;
  onManageScores: () => void;
  extraData?: ExtraData; // optional, since data might still be loading
};

const StaticMatchScreen: FC<Props> = ({
  match,
  isLoggedIn,
  onManageScores,
  extraData,
}) => {
  const isFinished = match.status === 2;

  return (
    <View style={styles.container}>
      <View style={styles.topPage}>
        <Text>{match.location.name}</Text>
        <Text>
          {new Date(match.planned_at).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
      </View>

      {/* Teams */}
      <View style={styles.teamsContainer}>
        <TeamAtom
          name={match.team1.name}
          matches={match.team1.last5Record}
          teamId={match.team1.id}
        />
        <View style={styles.miniContainer}>
          {match.status === 0 && (
            <>
              <Text>{new Date(match.planned_at).getHours()}h</Text>
              <Text>-</Text>
            </>
          )}
          {match.status === 2 && (
            <>
              <View style={styles.scoreContainer}>
                <Text>{match.score1}</Text>
                <Text>-</Text>
                <Text>{match.score2}</Text>
              </View>
            </>
          )}
        </View>
        <TeamAtom
          name={match.team2.name}
          matches={match.team2.last5Record}
          teamId={match.team2.id}
        />
      </View>

      {/* Blue line */}
      <View style={styles.blueline}></View>

      {/* Additional Data */}
      {extraData && (
        <>
          {/* Provisional Line-ups */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Provisional Line-ups</Text>
            <View style={styles.row}>
              <View style={styles.box}>
                <Text>{extraData.team1.available_players} players</Text>
              </View>
              <View style={styles.box}>
                <Text>{extraData.team2.available_players} players</Text>
              </View>
            </View>
          </View>

          {/* League Position */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>League Position</Text>
            <View style={styles.row}>
              <View style={styles.box}>
                <Text>{extraData.team1.position}</Text>
              </View>
              <View style={styles.box}>
                <Text>{extraData.team2.position}</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Manage Scores / Match Image */}
      <>
        {match.status === 1 && (
          <Button title="Manage Live Scores" onPress={onManageScores} />
        )}
        {match.status !== 0 && (
          <MatchImageAtom matchId={match.id} isLoggedIn={isLoggedIn} />
        )}
      </>
    </View>
  );
};

export default StaticMatchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  topPage: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginVertical: 20,
  },
  miniContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  blueline: {
    height: 4,
    backgroundColor: "#0000ff",
    marginVertical: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "bold",
  },
});
