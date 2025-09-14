import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StatusBar, useColorScheme, Platform } from "react-native";

const SafeAreaView = ({
  children,
  style,
  barColor,
  barStyle,
  enableBottomPadding = false,
}) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  // Default colors based on system theme
  const isDark = true;
  const defaultBarColor = isDark ? "#000" : "#fff";
  const defaultBarStyle = isDark ? "light-content" : "dark-content";

  return (
    <>
      <StatusBar
        backgroundColor={barColor || defaultBarColor}
        barStyle={barStyle || defaultBarStyle}
        translucent={false}
      />
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: enableBottomPadding ? insets.bottom : 0,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: barColor || defaultBarColor,
          ...style,
        }}
      >
        {children}
      </View>
    </>
  );
};

export default SafeAreaView;
