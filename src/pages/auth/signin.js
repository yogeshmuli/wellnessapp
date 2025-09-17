import { View, Image, TouchableOpacity } from "react-native";
import Text from "../../components/text";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { Typography, Spacing } from "../../styles";
import { SolidButton } from "../../components/buttons";
import Input from "../../components/inputs";
import useForm from "../../hooks/useForm";
import { login } from "../../redux/thunks/auth";
import { useDispatch } from "react-redux";
import LoadingOverlay from "../../components/loadingOverlay";
import SafeAreaView from "../../components/safearea/index";
import { useTheme } from "../../hooks/useTheme";
import Toast from "react-native-toast-message";

// Validation function for signin
const validate = (name, value) => {
  switch (name) {
    case "email":
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    default:
      return "";
  }
};

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { Colors } = useTheme();
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: "", password: "" },
    validate
  );

  const onClickSignUp = () => {
    navigation.navigate("Signup");
  };
  const onClickLogin = () => {
    handleSubmit((formValues) => {
      setLoading(true);
      let requestObject = {
        username: formValues.email,
        password: formValues.password,
      };
      dispatch(login(requestObject))
        .unwrap()
        .then(() => {
          setLoading(false);
          // navigation.navigate("Main");
        })
        .catch((error) => {
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: error.message || "An error occurred during login.",
          });
        });
    });
  };
  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackground }}>
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
            padding: 27,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
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
              Welcome Back, member
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
              <Text style={{ textAlign: "center" }}>
                {" "}
                Pick up your journey where you left off.{"\n"}
              </Text>
              <Text>Log in to track your habits, challenges, and growth.</Text>
            </Text>
          </View>
          <View style={{ height: 36 }}></View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <Input
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={(text) => handleChange("email", text)}
              error={errors.email}
            />
            <View style={{ height: 40 }}></View>
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry={true}
              value={values.password}
              onChangeText={(text) => handleChange("password", text)}
              error={errors.password}
            />

            <View style={{ height: 30 }}></View>
            <View>
              <TouchableOpacity onPress={onClickSignUp}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.lightText,
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
            <View style={{ height: 20 }}></View>
            <SolidButton title="Log In" onPress={() => onClickLogin()} />
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Signin;
