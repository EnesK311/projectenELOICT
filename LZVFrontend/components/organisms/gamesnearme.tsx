import React from "react";
import { View, StyleSheet } from "react-native";
import MatchCard from "../molecules/matchcard";
import TitleMain from "../atoms/titlemain";

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  location: string;
};

type Games = {
  matches: Match[];
};

const Gamesnearme: React.FC<Games> = ({ matches }) => (
  <View style={styles.container}>
    <TitleMain title="Wedstrijden In Je Buurt" />
    {matches.map((match) => (
      <MatchCard
        match={match}
        key={match.id}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        matchTime={match.matchTime}
        location={match.location}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default Gamesnearme;
