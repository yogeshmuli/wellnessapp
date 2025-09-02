import React from "react";
import { Text, View } from "react-native";
import { Colors, Typography } from "../../styles"; // Adjust the import path as necessary

export const Pills = ({
  backgroundColor = "#fff",
  textColor = "#000",
  paddingHorizontal = 10,
  paddingVertical = 5,
  borderRadius = 5,
  fontSize = 14,
  height = 40,

  title = "Pill Title",
}) => {
  return (
    <View
      style={{
        backgroundColor,
        paddingHorizontal,
        paddingVertical,
        borderRadius,
        alignItems: "center",
        justifyContent: "center",
        height,
      }}
    >
      <Text
        style={{
          color: textColor,
          fontSize,
          fontFamily: Typography.fontFamilyLight,
        }}
      >
        {" "}
        {title}
      </Text>
    </View>
  );
};
