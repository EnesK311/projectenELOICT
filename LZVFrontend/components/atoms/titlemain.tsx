import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TitleMainProps {
  title: string;
  color?: "white" | "black"; // Optional prop for color
}

const TitleMain = ({ title, color = "black" }: TitleMainProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TitleMain;
