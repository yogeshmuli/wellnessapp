import { Text } from "react-native";
import { Spacing, Typography } from "../../styles/index";
import { useTheme } from "../../hooks/useTheme";

export default function AppText({ children, style, ...props }) {
  const { Colors } = useTheme();
  return (
    <Text
      style={{
        color: Colors.text,
        fontSize: Typography.fontSizeMedium,
        fontFamily: Typography.fontFamily,

        padding: Spacing.small,
        ...style,
      }}
      {...props}
    >
      {children}
    </Text>
  );
}
