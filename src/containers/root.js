import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import LoadingOverlay from "../components/loadingOverlay";

import LoginScreen from "../pages/auth/screen0";
import SignupScreen from "../pages/auth/signup";
import SigninScreen from "../pages/auth/signin";
import SignupDetailsScreen from "../pages/auth/signup-details";

import MainApp from "./main";

import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Typography, Colors } from "../styles";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { navigationRef } from "../service/navigation.service";
import BootSplashScreen from "react-native-bootsplash";
import { getUser, getUserFeed } from "../redux/thunks/user";
import { fetchChallenges } from "../redux/thunks/challenge";
import { fetchFriendRequests, fetchFriendsList } from "../redux/thunks/friends";
import { fetchContent } from "../redux/thunks/content";

// Custom toast config
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4BB543", backgroundColor: "#F8F9FE" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: Typography.fontSizeMedium,
        fontWeight: Typography.fontWeightBold,
        color: Colors.success,
        fontFamily: Typography.fontFamilyBold,
      }}
      text2Style={{
        fontSize: Typography.fontSizeSmall,
        color: Colors.success,
        fontFamily: Typography.fontFamilyRegular,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#d32f2f", backgroundColor: "#fff0f0" }}
      text1Style={{
        fontSize: Typography.fontSizeMedium,
        fontWeight: Typography.fontWeightBold,
        color: "#d32f2f",
        fontFamily: Typography.fontFamilyBold,
      }}
      text2Style={{
        fontSize: Typography.fontSizeSmall,
        color: "#d32f2f",
        fontFamily: Typography.fontFamilyRegular,
      }}
    />
  ),
  // Add more custom types if needed
};
const Stack = createNativeStackNavigator();

const RootContainer = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const registrationInProgress = useSelector(
    (state) => state.auth.registrationInProgress
  );

  useEffect(() => {
    if (loading) {
      return;
    } else if (user) {
      fetchInitialData();
    } else {
      // SplashScreen.hide();
      BootSplashScreen.hide({ fade: true });
    }
  }, [loading]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([dispatch(getUser()), dispatch(getUserFeed())]);
      dispatch(fetchChallenges());
      dispatch(fetchFriendRequests());
      dispatch(fetchFriendsList());
      dispatch(fetchContent());
    } catch {
      console.error("Failed to fetch initial data");
    } finally {
      // SplashScreen.hide();
      BootSplashScreen.hide({ fade: true });
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [dispatch, registrationInProgress]);

  function handleAuthStateChanged(user) {
    if (registrationInProgress) {
      // If registration is in progress, do not set user
      return;
    }
    setUser(user);
    setLoading(false);
  }

  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="Main" component={MainApp} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Signin" component={SigninScreen} />
              <Stack.Screen
                name="SignupDetails"
                component={SignupDetailsScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast
        config={toastConfig}
        position="top"
        visibilityTime={3000}
        autoHide={true}
        topOffset={50}
        swipeable
      />
    </>
  );
};

export default RootContainer;
