import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  textColor?: string;
  style?: ViewStyle; // Allow custom styles to be passed
}

export const Button = ({
  title,
  onPress,
  disabled = false,
  color = "#007BFF",
  textColor = "#fff",
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
        style, // Apply custom styles
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    padding: 12,
    width: "100%", // Default to full width
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.7,
  },
});
