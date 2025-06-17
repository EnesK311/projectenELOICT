import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface InputFieldProps extends TextInputProps {
  hasError?: boolean;
}

export const InputField = ({ hasError, ...props }: InputFieldProps) => {
  return (
    <TextInput
      style={[styles.input, hasError && styles.inputError]}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#8B4513",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "red",
  },
});
