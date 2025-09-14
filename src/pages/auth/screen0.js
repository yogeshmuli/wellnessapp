import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from "../../components/text";

import { Typography, Spacing } from "../../styles";
import { OutlinedButton, SolidButton } from "../../components/buttons";
import SafeAreaView from "../../components/safearea";
import FontAwsome from "react-native-vector-icons/FontAwesome5";
import { useTheme } from "../../hooks/useTheme";

const StepIndicator = ({ steps, currentStep, onClick }) => {
  const { Colors } = useTheme();
  const getActiveColor = (step) => {
    switch (step) {
      case 1:
        return Colors.q1;
      case 2:
        return Colors.q2;
      case 3:
        return Colors.q3;
      case 4:
        return Colors.q4;
      default:
        return Colors.gray;
    }
  };
  return (
    <View
      style={{
        width: "100%",
        height: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text style={{ backgroundColor: "blue" }}>Hello</Text> */}
      {Array.from({ length: steps }).map((_, index) => (
        <TouchableOpacity key={index} onPress={() => onClick(index + 1)}>
          <View
            style={{
              width: currentStep === index + 1 ? 32 : 10,
              height: "100%",
              backgroundColor:
                currentStep === index + 1
                  ? getActiveColor(index + 1)
                  : Colors.gray,
              borderRadius: 5,
              // flex: 1,
              marginHorizontal: 5,
            }}
          ></View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigation = useNavigation();
  const { Colors } = useTheme();
  const gotoSignUp = () => {
    navigation.navigate("Signup");
  };
  const gotoSignIn = () => {
    navigation.navigate("Signin");
  };
  const getActiveColor = (step) => {
    switch (step) {
      case 1:
        return Colors.q1;
      case 2:
        return Colors.q2;
      case 3:
        return Colors.q3;
      case 4:
        return Colors.q4;
      default:
        return Colors.gray;
    }
  };
  const renderStep = () => {
    switch (currentStep) {
      case 0: {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 36,
                fontWeight: "bold",
                marginBottom: Spacing.small,
              }}
            >
              Welcome to the{" "}
              <Text style={{ color: Colors.q4, fontSize: 36 }}>
                Brotherhood
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: Colors.lightText,
                textAlign: "center",
                marginBottom: Spacing.medium,
                marginTop: 0,
                paddingTop: 0,
                lineHeight: 30,
              }}
            >
              Transform yourself into the complete man you're destined to
              become. Join thousands of brothers on their journey to excellence.
            </Text>
            <SolidButton
              style={{ width: 350 }}
              title="Begin Your Journey"
              onPress={() => {
                setCurrentStep(1);
              }}
            />
            <TouchableOpacity onPress={gotoSignIn}>
              <Text
                style={{
                  fontFamily: Typography.fontFamilyRegular,
                  color: Colors.lightText,
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: Spacing.small,
                }}
              >
                Already a brother?{" "}
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
                    color: Colors.primary,
                    fontWeight: Typography.fontWeightBold,
                  }}
                >
                  Sign In
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
      case 1: {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 121,
                top: 115,
                height: 96,
                width: 96,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.primary,
                borderRadius: 48,
              }}
            >
              <FontAwsome name="heartbeat" size={30} color={Colors.white} />
            </View>
            <View style={{ height: 84 }}></View>
            <Text
              style={{
                fontSize: 30,
                lineHeight: 36,
                fontWeight: Typography.fontWeightBold,
                marginTop: Spacing.small,
              }}
            >
              Health & Vitality
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: Colors.lightText,
                textAlign: "center",
                marginBottom: Spacing.medium,
                marginTop: 0,
                paddingTop: 0,
                lineHeight: 30,
              }}
            >
              Master your body through strength, sleep, nutrition, and daily
              vitality rituals.
            </Text>
          </View>
        );
      }
      case 2: {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // margin: Spacing.large,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 121,
                top: 115,
                height: 96,
                width: 96,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.q2,
                borderRadius: 48,
              }}
            >
              <FontAwsome name="brain" size={30} color={Colors.white} />
            </View>
            <View style={{ height: 84 }}></View>
            <Text
              style={{
                fontSize: 30,
                lineHeight: 36,
                fontWeight: Typography.fontWeightBold,
                marginTop: Spacing.small,
              }}
            >
              Inner Growth & Grit
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: Colors.lightText,
                textAlign: "center",
                marginBottom: Spacing.medium,
                marginTop: 0,
                paddingTop: 0,
                lineHeight: 30,
              }}
            >
              Develop mental toughness, self- discipline, and an unshakable
              mindset.
            </Text>
          </View>
        );
      }
      case 3: {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",

              // margin: Spacing.large,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 121,
                top: 115,
                height: 96,
                width: 96,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.q3,
                borderRadius: 48,
              }}
            >
              <FontAwsome name="users" size={30} color={Colors.white} />
            </View>
            <View style={{ height: 84 }}></View>
            <Text
              style={{
                fontSize: 30,
                lineHeight: 36,
                fontWeight: Typography.fontWeightBold,
                marginTop: Spacing.small,
                textAlign: "center",
              }}
            >
              Relationships & Leadership
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: Colors.lightText,
                textAlign: "center",
                marginBottom: Spacing.medium,
                marginTop: 0,
                paddingTop: 0,
                lineHeight: 30,
              }}
            >
              Lead with empathy, strengthen bonds with family, and inspire your
              tribe.
            </Text>
          </View>
        );
      }
      case 4: {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 121,
                top: 115,
                height: 96,
                width: 96,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.q4,
                borderRadius: 48,
              }}
            >
              <FontAwsome name="chart-line" size={30} color={Colors.white} />
            </View>
            <View style={{ height: 84 }}></View>
            <Text
              style={{
                fontSize: 30,
                lineHeight: 36,
                fontWeight: Typography.fontWeightBold,
                marginTop: Spacing.small,
              }}
            >
              Wealth & Freedom
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: Colors.lightText,
                textAlign: "center",
                marginBottom: Spacing.medium,
                marginTop: 0,
                paddingTop: 0,
                lineHeight: 30,
              }}
            >
              Build smart money habits, create freedom, and design the life you
              choose.
            </Text>
          </View>
        );
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackground }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
          paddingVertical: 49,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 32,
            borderBottomWidth: 1,
            borderColor: Colors.primary,
          }}
        >
          {currentStep > 0 && (
            <TouchableOpacity onPress={gotoSignUp}>
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: Typography.fontWeightBold,

                  textAlign: "center",
                }}
              >
                {"Skip >"}{" "}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {renderStep()}
        {currentStep > 0 && (
          <>
            <StepIndicator
              steps={4}
              currentStep={currentStep}
              onClick={(step) => setCurrentStep(step)}
            />
            <SolidButton
              title="Next"
              style={{
                width: "100%",
                marginTop: 27,
                backgroundColor: getActiveColor(currentStep),
              }}
              onPress={() => {
                if (currentStep < 4) {
                  setCurrentStep(currentStep + 1);
                } else {
                  gotoSignUp();
                }
              }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
