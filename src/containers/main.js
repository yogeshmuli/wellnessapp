import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { View, TouchableOpacity, Alert } from "react-native";
import Text from "../components/text";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwsome from "react-native-vector-icons/FontAwesome5";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../styles";

import HomeContainer from "./home";
import ProfileScreen from "../pages/profile";
import ChallengesContainer from "./challenge"; // Importing the Challenges container
import FriendsContainer from "./friends";
import ContentContainer from "./content";
import HabitContainer from "./habbit";
import { useSocket } from "../hooks/useSocket";

import notifee, {
  AuthorizationStatus,
  EventType,
  AndroidStyle,
} from "@notifee/react-native";
import { navigationRef } from "../service/navigation.service";
import Toast from "react-native-toast-message";
import { useTheme } from "../hooks/useTheme";

export async function requestNotificationPermission() {
  // iOS + Android 13+ both need runtime permission
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log("✅ Notifications authorized");
    return true;
  } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    console.log("❌ Notifications denied");
    return false;
  }
}

const Tab = createBottomTabNavigator();

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const safeAreaInsets = useSafeAreaInsets();
  const { Colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: Colors.bodyBackground,
        borderTopWidth: 1,
        borderTopColor: Colors.lightBorder,
        height: 80 + safeAreaInsets.bottom,
        alignItems: "flex-start",
        paddingTop: 8,

        paddingBottom: safeAreaInsets.bottom,
        paddingHorizontal: 8,
        justifyContent: "space-around",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        // Get icon from tabBarIcon option
        const isFocused = state.index === index;
        const color = isFocused ? Colors.white : Colors.text;
        const backgroundColor = isFocused ? Colors.primary : "transparent";
        const size = 24;
        let icon = null;
        if (typeof options.tabBarIcon === "function") {
          icon = options.tabBarIcon({ color, size, focused: isFocused });
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: backgroundColor,
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 0,
            }}
          >
            {icon}
            <View style={{ height: 4 }} />
            <Text
              style={{
                color: color,
                fontSize: 12,
                fontFamily: Typography.fontFamilyRegular,
                paddingHorizontal: 0,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Utility to get the active route name from navigation state

const MainContainer = () => {
  const { listenForMessages, socket } = useSocket();

  useEffect(() => {
    let unsubscribeNotifee = notifee.onForegroundEvent((event) => {
      if (event.type === EventType.PRESS) {
        console.log("Notification pressed:", event.detail);
        switch (event.detail.notification.data.type) {
          case "message":
            const { payload: sender } = event.detail.notification.data;
            navigationRef.current?.navigate("Community", {
              screen: "Chat",
              params: { friend: sender },
            });
            break;
          case "friend_request":
          case "friend_request_accepted":
            const { payload: friend } = event.detail.notification.data;
            navigationRef.current?.navigate("Community", {
              screen: "FriendsList",
              params: { friend },
            });
            break;

          default:
            break;
        }
      }
    });
    async function addListeners() {
      try {
        console.log("Adding socket listeners");
        await listenForMessages();
        socket.on("message", (message) => {
          const activeRouteName =
            navigationRef.current?.getCurrentRoute()?.name;

          if (activeRouteName !== "Chat") {
            let notificationMessage = {
              title: "New Message",
              body: `${message.sender.displayName} sent you a message`,
              data: {
                type: "message",
                payload: message.sender,
              },
            };
            showNotification(notificationMessage);
          }
        });
        socket.on("notification", handleSocketNotification);
      } catch (error) {
        console.error("Error adding socket listeners:", error);
      }
    }
    requestNotificationPermission();
    addListeners();

    return () => {
      socket.off("message");
      socket.off("notification");

      unsubscribeNotifee();
    };
  }, [listenForMessages]);

  const handleSocketNotification = async (notification) => {
    try {
      switch (notification.type) {
        case "friend_request_received": {
          // Handle friend request received
          let sender = notification.payload.sender;
          let message = {
            title: "New Friend Request",
            body: `${sender.displayName} sent you a friend request`,
            data: {
              type: "friend_request",
              payload: sender,
            },
          };
          let activeRouteName = navigationRef.current?.getCurrentRoute()?.name;
          if (activeRouteName !== "FriendsList") {
            showNotification(message);
          }
          break;
        }
        case "friend_request_accepted": {
          let sender = notification.payload.sender;
          let message = {
            title: "Friend Request Accepted",
            body: `${sender.displayName} accepted your friend request`,
            data: {
              type: "friend_request_accepted",
              payload: sender,
            },
          };
          let activeRouteName = navigationRef.current?.getCurrentRoute()?.name;
          if (activeRouteName !== "FriendsList") {
            showNotification(message);
          }
          break;
        }
        case "badge_received": {
          let badge = notification.payload.badge;

          let message = {
            title: "New Badge Earned",
            body: `You earned a new badge! ${badge.name}`,
            data: {
              type: "badge_received",
              payload: badge,
            },
          };
          let activeRouteName = navigationRef.current?.getCurrentRoute()?.name;
          if (activeRouteName !== "Profile") {
            showNotification(message);
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.error("Error handling socket notification:", error);
    }
  };

  const showNotification = async (message) => {
    try {
      // used for native notifications
      // const channelId = await notifee.createChannel({
      //   id: "default",
      //   name: "Default Channel",
      // });

      // await notifee.displayNotification({
      //   title: message?.title || "New Message",
      //   body: message?.body || "No content",
      //   data: message?.data,
      //   android: {
      //     channelId,

      //     largeIcon: message?.sender?.photoUrl, // Optional: sender's avatar
      //   },
      // });
      Toast.show({
        text1: message?.title || "New Message",
        text2: message?.body || "No content",
        onPress: () => {
          switch (message.data.type) {
            case "message":
              const { payload: sender } = message.data;
              navigationRef.current?.navigate("Community", {
                screen: "Chat",
                params: { friend: sender },
              });
              break;
            case "friend_request":
            case "friend_request_accepted":
              const { payload: friend } = message.data;
              navigationRef.current?.navigate("Community", {
                screen: "FriendsList",
                params: { friend },
              });
              break;

            default:
              break;
          }
        },
      });
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  };

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "shift",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeContainer}
        options={{
          popToTopOnBlur: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
            const nestedRoutes = ["Notifications"];
            if (nestedRoutes.includes(currentRoute)) {
              e.preventDefault();
              navigation.navigate("Home", { screen: "HomeScreen" });
            }
          },
        })}
      />
      {/* habbit */}
      <Tab.Screen
        name="Habits"
        component={HabitContainer}
        options={{
          popToTopOnBlur: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwsome name="book" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
            const nestedRoutes = ["HabitDetails"];
            if (nestedRoutes.includes(currentRoute)) {
              e.preventDefault();
              navigation.navigate("Habits", { screen: "HabitList" });
            }
          },
        })}
      />
      {/* challenges */}
      <Tab.Screen
        name="Challenges"
        component={ChallengesContainer} // Replace with actual Challenges screen
        options={{
          popToTopOnBlur: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
            const nestedRoutes = ["ChallengeDetails"];
            if (nestedRoutes.includes(currentRoute)) {
              e.preventDefault();
              navigation.navigate("Challenges", { screen: "ChallengeList" });
            }
          },
        })}
      />

      {/* community */}
      <Tab.Screen
        name="Community"
        component={FriendsContainer} // Replace with actual Community screen
        options={{
          tabBarLabel: "Community",
          popToTopOnBlur: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwsome name="users" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
            const nestedRoutes = [
              "Chat",
              "Search",
              "FriendProfile",
              "FriendsList",
            ];
            if (nestedRoutes.includes(currentRoute)) {
              e.preventDefault();
              navigation.navigate("Community", { screen: "Feed" });
            }
          },
        })}
      />
      {/* content */}
      {/* <Tab.Screen
        name="Content"
        component={ContentContainer}
        options={{
          popToTopOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <FeatherIcon name="book-open" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
            const nestedRoutes = ["ContentDetails"];
            if (nestedRoutes.includes(currentRoute)) {
              e.preventDefault();
              navigation.navigate("Content", { screen: "ContentList" });
            }
          },
        })}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainContainer;
