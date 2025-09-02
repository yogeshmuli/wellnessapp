import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Typography, Spacing, Colors } from "../../styles/index";
import { AsyncImage, Avatars } from "../../components/avatars";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Pills } from "../../components/pills";

export const ContentCard = ({ data }) => {
  const navigation = useNavigation();
  const { type, title, body, posterUrl } = data;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ContentDetails", { content: data })}
      style={{
        backgroundColor: Colors.white,
        borderRadius: Spacing.small,
        padding: Spacing.medium,
        marginBottom: Spacing.medium,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: "column",
        width: "100%",
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        {posterUrl ? (
          <AsyncImage
            source={posterUrl}
            style={{ width: 60, height: 60, borderRadius: Spacing.small }}
            // resizeMode="cover"
          />
        ) : (
          <Icon name="image-outline" size={50} color={Colors.gray} />
        )}
        <View
          style={{
            marginTop: Spacing.small,
            flexDirection: "column",
            marginLeft: Spacing.medium,
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",

              alignItems: "flex-start",
              marginBottom: Spacing.small,
            }}
          >
            <Text
              style={{
                ...Typography.body,
                fontWeight: "bold",
                fontFamily: Typography.fontFamilyBold,

                flexShrink: 1,
              }}
            >
              {title}
            </Text>
            <View
              style={{
                width: "auto",
                padding: 3,
                borderRadius: 999,

                backgroundColor: Colors.primary,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: Typography.fontFamily,
                  color: Colors.white,
                }}
              >
                {type}
              </Text>
            </View>
          </View>
          <Text
            style={{
              ...Typography.body,
              color: Colors.gray,
              fontFamily: Typography.fontFamily,
            }}
          >
            {body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
