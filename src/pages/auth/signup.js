import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Typography, Spacing, Colors } from "../../styles";
import { SolidButton } from "../../components/buttons";
import Input from "../../components/inputs";
import useForm from "../../hooks/useForm"; // <-- Import the hook
import SafeAreaView from "../../components/safearea";

// Validation function
const validate = (name, value, values) => {
  switch (name) {
    case "email":
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    case "confirmPassword":
      if (!value) return "Confirm your password";
      if (value !== values.password) return "Passwords do not match";
      return "";
    default:
      return "";
  }
};

const Signup = () => {
  const navigation = useNavigation();
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: "", password: "", confirmPassword: "" },
    validate
  );

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
                1
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
              Tell us about yourself
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
            {/* email */}
            <Input
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={(text) => handleChange("email", text)}
              error={errors.email}
            />

            <View style={{ height: 30 }}></View>
            {/* password */}
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry={true}
              value={values.password}
              onChangeText={(text) => handleChange("password", text)}
              error={errors.password}
            />
            <View style={{ height: 30 }}></View>
            {/* confirm password */}
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry={true}
              value={values.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              error={errors.confirmPassword}
            />
            <View style={{ height: 30 }}></View>
            {/* Next btn */}
            <SolidButton
              title="Next"
              onPress={() =>
                handleSubmit((formValues) => {
                  navigation.navigate("SignupDetails", { ...formValues });
                })
              }
            />
            {/* Already have account go to signin */}
            <View style={{ height: 16 }}></View>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                <Text
                  style={{
                    fontSize: Typography.fontSizeSmall,
                    color: Colors.gray,
                    textAlign: "center",
                    fontFamily: Typography.fontFamily,
                  }}
                >
                  Already have an account?{" "}
                  <Text
                    style={{
                      color: Colors.primary,
                      fontFamily: Typography.fontFamilyBold,
                    }}
                  >
                    Sign In
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Signup;
