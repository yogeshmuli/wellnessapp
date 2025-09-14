import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HabitList from "../pages/habits/list";
import HabitDetails from "../pages/habits/details";

const Stack = createNativeStackNavigator();

const HabitContainer = () => {
  return (
    <Stack.Navigator>
      {/* Define your screens here */}
      <Stack.Screen
        name="HabitList"
        component={HabitList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HabitDetails"
        component={HabitDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HabitContainer;
