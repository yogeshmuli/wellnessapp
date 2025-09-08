import React from "react";
// import {
//   createNativeStackNavigator,
//   cardStyleInterpolator,
// } from "@react-navigation/native-stack";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import List from "../pages/challenges/list";
import Details from "../pages/challenges/details"; // Adjust the import path as necessary
import TaskDetails from "../pages/challenges/taskdetails";
const ChallengesStack = createStackNavigator();

const ChallengeContainer = () => {
  return (
    <ChallengesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ChallengesStack.Screen name="ChallengeList" component={List} />
      <ChallengesStack.Screen name="ChallengeDetails" component={Details} />
      <ChallengesStack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{
          gestureDirection: "vertical",
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
    </ChallengesStack.Navigator>
  );
};

export default ChallengeContainer;
