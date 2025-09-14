import React from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks/useTheme";

const ProgressBar = ({ progress, color, height = 10 }) => {
  const { Colors } = useTheme();
  return (
    <View
      style={{
        height: height,
        borderRadius: 5,
        backgroundColor: Colors.lightGray,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: color ? color : Colors.primary,
          borderRadius: 5,
        }}
      />
    </View>
  );
};

export default ProgressBar;
