import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Typography, Spacing, Colors } from "../../styles";
import { OutlinedButton, SolidButton } from "../../components/buttons";

const Login = () => {
  const navigation = useNavigation();
  const onClickSignInWithEmail = () => {
    // Handle Email login
    navigation.navigate("Signin");
  };
  const onClickSignUp = () => {
    // Handle Sign Up
    navigation.navigate("Signup");
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          padding: Spacing.large,
          flexDirection: "column",

          justifyContent: "center",
          alignItems: "stretch",
          backgroundColor: Colors.body,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: 100, height: 100, marginBottom: 20 }}
          />
          <Text
            style={{
              fontSize: Typography.fontSizeXLarge,
              marginBottom: Spacing.small,
              fontFamily: Typography.fontFamilyBold,
              color: Colors.text,
            }}
          >
            WellnessHub
          </Text>
          <Text
            style={{
              fontSize: Typography.fontSizeMedium,
              color: Colors.text,

              fontFamily: Typography.fontFamily,
            }}
          >
            Your Journey to Wellness Begins Here
          </Text>
        </View>
        <View style={{ height: 36 }}></View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",

            height: 180,
          }}
        >
          <OutlinedButton
            title="Continue with Google"
            icon={
              <Image
                source={require("../../assets/google.png")}
                style={{ width: 20, height: 20, marginRight: Spacing.small }}
              />
            }
            onPress={() => {
              // Handle Google login
            }}
          />

          <View style={{ height: 16 }}></View>
          <SolidButton
            title="Sign in with Email"
            onPress={onClickSignInWithEmail}
          />
          <View style={{ height: 16 }}></View>
          <View>
            <TouchableOpacity onPress={onClickSignUp}>
              <Text
                style={{
                  fontSize: Typography.fontSizeSmall,
                  color: Colors.gray,
                  textAlign: "center",
                  fontFamily: Typography.fontFamily,
                }}
              >
                Don't have an account?{" "}
                <Text
                  style={{
                    color: Colors.primary,
                    fontFamily: Typography.fontFamilyBold,
                  }}
                >
                  Sign Up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 36 }}></View>
        <Text
          style={{
            fontSize: Typography.fontSizeSmall,
            color: Colors.gray,
            textAlign: "center",
            fontFamily: Typography.fontFamily,
          }}
        >
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default Login;
