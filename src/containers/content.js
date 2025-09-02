import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContentList from "../pages/content/list";
import ContentDetails from "../pages/content/details";

const Stack = createNativeStackNavigator();

const ContentContainer = () => {
  return (
    <Stack.Navigator>
      {/* Define your screens here */}
      <Stack.Screen
        name="ContentList"
        component={ContentList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContentDetails"
        component={ContentDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ContentContainer;
