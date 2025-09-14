import React, { use, useEffect } from "react";
import { Colors, ColorsLight } from "../styles";
const ThemeContext = React.createContext();
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(Colors);

  useEffect(() => {
    AsyncStorage.getItem("themePreference").then((res) => {
      if (res) {
        if (res == "dark") {
          setTheme(Colors);
        } else {
          setTheme(ColorsLight);
        }
      }
    });
  }, []);

  const getActiveTheme = async () => {
    const themePreference = await AsyncStorage.getItem("themePreference");
    return themePreference || "light";
  };
  const changeTheme = (newTheme = "light") => {
    AsyncStorage.setItem("themePreference", newTheme);
    if (newTheme == "dark") {
      setTheme(Colors);
    } else {
      setTheme(ColorsLight);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        Colors: theme,
        changeTheme,
        getActiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
