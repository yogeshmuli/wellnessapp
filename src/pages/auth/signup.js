import { View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Text from "../../components/text";

import { Typography, Spacing, Colors } from "../../styles";
import { SolidButton } from "../../components/buttons";
import Input from "../../components/inputs";
import useForm from "../../hooks/useForm"; // <-- Import the hook
import SafeAreaView from "../../components/safearea";
import { useTheme } from "../../hooks/useTheme";

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
  const { Colors } = useTheme();

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
                Step Into The Journey
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
                Join a community of men committed to mastering health, mindset,
                relationships, and freedom.
              </Text>
            </View>

            <View style={{ height: 16 }}></View>
          </View>

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
            {/* Already have account go to signin */}

            <View>
              <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                <Text
                  style={{
                    color: Colors.lightText,
                    textAlign: "center",
                    fontFamily: Typography.fontFamily,
                    fontSize: 14,
                  }}
                >
                  Already have an account?{" "}
                  <Text
                    style={{
                      color: Colors.primary,
                      fontFamily: Typography.fontFamilyBold,
                      fontSize: 14,
                    }}
                  >
                    Sign In
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 20 }}></View>
            {/* Next btn */}
            <SolidButton
              title="Next"
              onPress={() => {
                handleSubmit((formValues) => {
                  navigation.navigate("SignupDetails", { ...formValues });
                });
              }}
            />
            <View style={{ height: 20 }}></View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Signup;
