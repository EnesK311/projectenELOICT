import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TitleMain from "./titlemain";

interface HeaderProps {
  title: string;
  winLossRecord?: string[]; // Optional prop for win/loss record
}

const Header = ({ title, winLossRecord }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <TitleMain title={title} color="white" />
      {winLossRecord && (
        <View style={styles.recordContainer}>
          <View style={styles.recordIcons}>
            {[...Array(5)].map((_, index) => (
              <IconSymbol
                key={index}
                name={
                  winLossRecord[index] === "W"
                    ? "checkmark.circle"
                    : winLossRecord[index] === "L"
                    ? "xmark.circle"
                    : winLossRecord[index] === "D"
                    ? "minus.circle"
                    : "circle"
                }
                size={20}
                color={
                  winLossRecord[index] === "W"
                    ? "green"
                    : winLossRecord[index] === "L"
                    ? "red"
                    : winLossRecord[index] === "D"
                    ? "yellow"
                    : "grey"
                }
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1A2B47", // Dark blue background
    paddingVertical: 15, // Reduced vertical padding for better spacing
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18, // Slightly smaller for longer titles
    fontWeight: "bold",
    color: "#fff", // White text
  },
  recordContainer: {
    alignItems: "center",
  },
  recordIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Header;
