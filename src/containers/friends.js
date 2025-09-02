import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const FriendsStack = createNativeStackNavigator();

import List from "../pages/friends/list";
import Chat from "../pages/friends/chat";
import Search from "../pages/friends/search";
import FriendProfile from "../pages/profile/index"; // Importing the FriendProfile component

const FriendsContainer = () => {
  return (
    <FriendsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <FriendsStack.Screen name="FriendsList" component={List} />
      <FriendsStack.Screen name="Chat" component={Chat} />
      <FriendsStack.Screen name="Search" component={Search} />
      <FriendsStack.Screen name="FriendProfile" component={FriendProfile} />
    </FriendsStack.Navigator>
  );
};

export default FriendsContainer;
