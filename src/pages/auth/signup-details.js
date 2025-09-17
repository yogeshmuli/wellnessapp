import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";

import { Typography, Spacing, Colors } from "../../styles";
import { SolidButton } from "../../components/buttons";
import Input, { MultiSelectInput, SelectInput } from "../../components/inputs";
import useForm from "../../hooks/useForm";
import { createUser } from "../../redux/thunks/auth";
import { useDispatch } from "react-redux";
import LoadingOverlay from "../../components/loadingOverlay";
import {
  Interests as InterestsConstant,
  FitnessLevelOptions,
} from "../../constants/index";
import SafeAreaView from "../../components/safearea";
import { useTheme } from "../../hooks/useTheme";
import Toast from "react-native-toast-message";

// Validation function for details
const validate = (name, value) => {
  switch (name) {
    case "fullname":
      if (!value) return "Full name is required";
      return "";
    case "age":
      if (!value) return "Age is required";
      if (isNaN(value) || Number(value) < 1) return "Enter a valid age";
      return "";
    case "interest":
      if (!value) return "Interest is required";
      return "";
    case "primaryGoal":
      if (!value) return "Primary goal is required";
      return "";
    default:
      return "";
  }
};

const SignupDetails = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { params } = useRoute();
  const { Colors } = useTheme();

  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      fullname: "",
      age: "",
      focusAreas: [],
      fitnessLevel: { label: "Beginner", value: "BEGINNER" },
    },
    validate
  );

  const onClickNext = () => {
    handleSubmit(async (formValues) => {
      try {
        setLoading(true);
        let requestObject = {
          email: params?.email ?? "",
          password: params?.password ?? "",
          fullname: formValues.fullname,
          age: formValues.age,
          focusAreas: formValues.focusAreas,
          fitnessLevel: formValues.fitnessLevel,
        };
        console.log("Signup request:", requestObject);

        await dispatch(createUser(requestObject)).unwrap();
        // navigation.navigate("Main");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Signup Failed",
          text2: error.message || "An error occurred during signup.",
        });
      }
    });
  };

  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }
  return (
    <SafeAreaView
      enableBottomPadding
      style={{ flex: 1, backgroundColor: Colors.bodyBackground }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            padding: Spacing.large,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: Typography.fontSizeXLarge,
                  marginHorizontal: Spacing.large,
                  marginBottom: Spacing.small,
                  fontFamily: Typography.fontFamilyBold,
                  color: Colors.text,
                  textAlign: "center",
                }}
              >
                Complete Your Profile
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.text,
                  fontFamily: Typography.fontFamily,
                  lineHeight: 30,
                  textAlign: "center",
                  width: 320,
                }}
              >
                Help us personalize your habits and challenges. A few quick
                details to shape your journey.
              </Text>
            </View>
          </View>
          <View style={{ height: 32 }}></View>
          {/* Form */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={values.fullname}
              onChangeText={(text) => handleChange("fullname", text)}
              error={errors.fullname}
            />
            <View style={{ height: 30 }}></View>
            {/* Age */}
            <Input
              label="Age"
              placeholder="Enter your age"
              keyboardType="number-pad"
              value={values.age}
              onChangeText={(text) => handleChange("age", text)}
              error={errors.age}
            />
            <View style={{ height: 30 }}></View>

            <SelectInput
              label="Fitness Level"
              options={FitnessLevelOptions}
              placeholder="Select your fitness level"
              value={values.fitnessLevel}
              onChange={(item) => handleChange("fitnessLevel", item)}
              error={errors.fitnessLevel}
            />
            <View style={{ height: 30 }}></View>
            {/* Interest Multiselect */}
            <MultiSelectInput
              label="Focus Areas"
              placeholder="Select your focus areas "
              options={InterestsConstant}
              selected={values.focusAreas}
              onChange={(selected) => {
                handleChange("focusAreas", selected);
              }}
              error={errors.focusAreas}
            />

            <View style={{ height: 30 }}></View>
            {/* Next btn */}
            <SolidButton title="Next" onPress={() => onClickNext()} />
            {/* Back to signup */}
            <View style={{ height: 16 }}></View>
            <View>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.text,
                    textAlign: "center",
                    fontFamily: Typography.fontFamily,
                  }}
                >
                  Back to Signup
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 16 }}></View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignupDetails;
