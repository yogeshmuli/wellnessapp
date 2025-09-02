import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { Typography, Spacing, Colors } from "../../styles";
import { SolidButton } from "../../components/buttons";
import Input from "../../components/inputs";
import useForm from "../../hooks/useForm";
import { login } from "../../redux/thunks/auth";
import { useDispatch } from "react-redux";
import LoadingOverlay from "../../components/loadingOverlay";
import SafeAreaView from "../../components/safearea/index";

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
        });
    });
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
            justifyContent: "center",
            alignItems: "stretch",
            backgroundColor: Colors.body,
          }}
        >
          <View style={{ alignItems: "center" }}>
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

            <View style={{ height: 40 }}></View>
            <SolidButton title="Login" onPress={() => onClickLogin()} />
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Signin;
