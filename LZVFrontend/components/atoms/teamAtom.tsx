import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";

interface TeamAtomProps {
  name: string;
  matches: string[];
  teamId: number;
}

const TeamAtom = ({ name, matches, teamId }: TeamAtomProps) => {
  const router = useRouter();

  // Ensure we always have 5 items, filling with "empty" if necessary
  const lastFiveMatches = [...Array(5)].map(
    (_, index) => matches[matches.length - 5 + index] || "empty"
  );

  const handlePress = () => {
    router.push({
      pathname: "/teamstatistics",
      params: { id: teamId },
    });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={styles.teamName}>{name}</Text>
      <View style={styles.matchesContainer}>
        {lastFiveMatches.map((result, index) => (
          <IconSymbol
            key={index}
            name={
              result === "W"
                ? "checkmark.circle"
                : result === "L"
                ? "xmark.circle"
                : result === "D"
                ? "minus.circle"
                : "circle"
            }
            size={20}
            color={
              result === "W"
                ? "green"
                : result === "L"
                ? "red"
                : result === "D"
                ? "orange"
                : "grey"
            }
          />
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 10,
  },
  teamName: {
    fontSize: 15,
    marginBottom: 5,
  },
  matchesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default TeamAtom;
