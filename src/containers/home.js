import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../pages/home/index";
import NotificationScreen from "../pages/home/notification";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
