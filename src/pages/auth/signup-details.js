import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";

import { Typography, Spacing, Colors } from "../../styles";
import { SolidButton } from "../../components/buttons";
import Input, { MultiSelectInput } from "../../components/inputs";
import useForm from "../../hooks/useForm";
import { createUser } from "../../redux/thunks/auth";
import { useDispatch } from "react-redux";
import LoadingOverlay from "../../components/loadingOverlay";
import { Interests as InterestsConstant } from "../../constants/index";
import SafeAreaView from "../../components/safearea";

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

  const { values, errors, handleChange, handleSubmit } = useForm(
    { fullname: "", age: "", interest: [], primaryGoal: "" },
    validate
  );

  const onClickNext = () => {
    handleSubmit(async (formValues) => {
      try {
        setLoading(true);
        let requestObject = {
          email: params.email,
          password: params.password,
          fullname: formValues.fullname,
          age: formValues.age,
          interest: formValues.interest,
          primaryGoal: formValues.primaryGoal,
        };

        await dispatch(createUser(requestObject)).unwrap();
        // navigation.navigate("Main");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Signup failed:", error);
        // Handle error, e.g., show a toast message
      }
    });
  };
  const mapMultiSelectOptions = (options) => {
    return options.map((option) => ({
      label: option,
      value: option,
    }));
  };
  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.body }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
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
            backgroundColor: Colors.body,
          }}
        >
          {/* Header */}
          <View
            style={{
              height: 92,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: Colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: Typography.fontSizeMedium,
                  fontFamily: Typography.fontFamilyBold,
                }}
              >
                2
              </Text>
            </View>
            <View style={{ height: 16 }}></View>
            <Text
              style={{
                fontSize: Typography.fontSizeLarge,
                fontFamily: Typography.fontFamilyBold,
                color: Colors.textPrimary,
                marginTop: Spacing.small,
              }}
            >
              Tell us more about you
            </Text>
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
            {/* Primary Goal */}
            <Input
              label="Primary Goal"
              placeholder="What is your primary goal?"
              value={values.primaryGoal}
              onChangeText={(text) => handleChange("primaryGoal", text)}
              error={errors.primaryGoal}
            />
            <View style={{ height: 30 }}></View>
            {/* Interest Multiselect */}
            <MultiSelectInput
              label="Interests"
              placeholder="Select your interests"
              options={mapMultiSelectOptions(InterestsConstant)}
              selected={mapMultiSelectOptions(values.interest)}
              onChange={(selected) => {
                let updatedInterests = selected.map((item) => item.value);
                handleChange("interest", updatedInterests);
              }}
              error={errors.interest}
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
                    fontSize: Typography.fontSizeSmall,
                    color: Colors.gray,
                    textAlign: "center",
                    fontFamily: Typography.fontFamily,
                  }}
                >
                  Back to Signup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignupDetails;
