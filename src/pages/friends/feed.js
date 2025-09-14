import React, { use } from "react";
import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import Text from "../../components/text";
import SafeAreaView from "../../components/safearea";
import { Typography, Spacing } from "../../styles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";

import { SolidButton } from "../../components/buttons";
const FriendsFeed = () => {
  const navigate = useNavigation();
  const { Colors } = useTheme();

  const goToFriendsList = () => {
    navigate.navigate("FriendsList");
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: Colors.bodyBackground,
      }}
    >
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <View style={{ flex: 1, width: "100%", paddingHorizontal: 17.5 }}>
          {/* header */}
          <View
            style={{
              paddingVertical: Spacing.small,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {}}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 0,
                  paddingLeft: 0,
                  color: Colors.text,
                }}
              >
                {"Community Feed"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Goto Friends list */}
          <TouchableOpacity onPress={goToFriendsList}>
            <View
              style={{
                width: "100%",
                backgroundColor: Colors.info,
                paddingHorizontal: Spacing.medium,
                paddingVertical: Spacing.small,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: Colors.white,
                    fontFamily: Typography.fontFamilyBold,
                    flexWrap: "wrap",
                    paddingHorizontal: 0,
                  }}
                >
                  See Your Community Connections
                </Text>
                <Text
                  style={{
                    fontFamily: Typography.fontFamilyRegular,
                    color: Colors.white,
                    paddingHorizontal: 0,
                    paddingVertical: 2,
                  }}
                >
                  Connect with your fitness brothers
                </Text>
              </View>
              <FontAwesome5 name="users" size={25} color={Colors.white} />
              <View style={{ width: 10 }} />
              <FontAwesome5
                name="chevron-right"
                size={20}
                color={Colors.white}
              />
            </View>
          </TouchableOpacity>
          {/* post div */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: Spacing.large,
              marginBottom: Spacing.medium,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: 50,
                borderColor: Colors.lightBorder,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: Spacing.medium,
                color: Colors.text,
                backgroundColor: Colors.cardBackground,
                fontFamily: Typography.fontFamilyRegular,
                fontSize: Typography.fontSizeMedium,
                paddingTop: 13,
              }}
              placeholder="What's on your mind?"
              placeholderTextColor={Colors.lightText}
              multiline
            />
            <SolidButton
              title="Post"
              icon={
                <View style={{ marginHorizontal: Spacing.small }}>
                  <FontAwesome5
                    name="paper-plane"
                    size={16}
                    color={Colors.white}
                    solid
                  />
                </View>
              }
              onPress={() => {}}
              style={{
                width: 100,
                height: 50,
                marginLeft: Spacing.medium,
                borderRadius: 6,
              }}
              textStyle={{
                fontFamily: Typography.fontFamilyMedium,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FriendsFeed;
