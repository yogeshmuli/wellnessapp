import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors, Typography } from "../../styles";

export const OutlinedButton = ({
  title,
  icon,
  onPress,
  style = {},
  textStyle = {},
  iconStyle = {},

  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 50,
        backgroundColor: Colors.transparent,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 12,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {icon && icon}
      <Text
        style={{
          fontSize: Typography.fontSizeMedium,
          color: Colors.text,

          textAlign: "center",
          fontFamily: Typography.fontFamilyMedium,
          ...textStyle,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const SolidButton = ({
  title,
  icon,
  onPress,
  style = {},
  textStyle = {},
  iconStyle = {},
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 50,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        display: "flex",
        flexDirection: "row",
        // width: "100%",
        alignItems: "center",
        justifyContent: "center",

        ...style,
      }}
      disabled={disabled}
    >
      {icon && icon}
      <Text
        style={{
          fontSize: Typography.fontSizeMedium,
          color: Colors.white,
          textAlign: "center",
          fontFamily: Typography.fontFamilyMedium,
          ...textStyle,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
