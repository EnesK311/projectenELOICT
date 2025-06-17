import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, ViewStyle } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  "soccerball.fill": "sports_soccer", // Sports icon
  "chart.bar.fill": "bar-chart", // Statistics icon
  "arrow.2.squarepath": "loop", // Strategy icon
  "person.fill": "person", // Profile icon
  "tune.fill": "tune", // Settings icon
  "checkmark.circle": "check-circle", // Win
  "xmark.circle": "cancel", // Loss
  "minus.circle": "remove-circle", // Draw
  circle: "radio-button-unchecked", // Empty
} as unknown as Partial<
  Record<
    import("expo-symbols").SymbolViewProps["name"],
    React.ComponentProps<typeof MaterialIcons>["name"]
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || "help-outline"; // Fallback for undefined mappings
  console.log("Icon name passed:", iconName);

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconName}
      //@ts-ignore
      style={style}
    />
  );
}
