import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface StatSquareProps {
  value: string;
  label: string;
  sublabel?: string;
  onPress?: () => void; // Callback function for navigation or action
}

const StatSquare = ({ value, label, sublabel, onPress }: StatSquareProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.square}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    width: Dimensions.get("window").width / 2 - 20,
    height: Dimensions.get("window").width / 2 - 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    margin: 10,
  },
  value: {
    fontSize: 30, // Reduced font size
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  label: {
    fontSize: 14, // Reduced font size
    color: "#333",
    textAlign: "center",
  },
  sublabel: {
    fontSize: 12, // Reduced font size
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
});

export default StatSquare;
