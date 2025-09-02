import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Typography, Spacing, Colors } from "../../styles/index";
import { AsyncImage, Avatars } from "../../components/avatars";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export const FriendJoinedCard = ({ data }) => {
  const navigation = useNavigation();
  const { user: friend, challenge, createdAt } = data;
  const onClick = () => {
    try {
      navigation.navigate("Challenges", {
        screen: "ChallengeDetails",
        params: { challenge },
      });
    } catch (error) {}
  };
  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={{
          backgroundColor: Colors.white,
          borderRadius: 12,
          width: "100%",
          padding: Spacing.medium,
          marginBottom: Spacing.medium,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          flexDirection: "column",
        }}
      >
        {/* Name and avatar section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: Spacing.large,
          }}
        >
          {friend?.photoUrl ? (
            <Avatars imageSource={friend.photoUrl} size={50} />
          ) : (
            <Icon name="person-circle-outline" size={50} color={Colors.gray} />
          )}
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSizeMedium,
                fontWeight: Typography.fontWeightBold,
                color: Colors.text,
                marginLeft: Spacing.medium,
                marginBottom: 3,
              }}
            >
              {friend.displayName}
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSizeSmall,
                color: Colors.lightText,
                marginLeft: Spacing.medium,
              }}
            >
              {friend.tagLine || ""}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: Typography.fontSizeMedium,
            fontWeight: Typography.fontFamilyMediumItalic,
            color: Colors.text,
          }}
        >
          Joined the {challenge.title} challenge!
        </Text>
        <AsyncImage
          source={challenge.imageUrl}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 0,
            marginTop: Spacing.small,
          }}
        />
        {/* occured at date*/}
        <View
          style={{
            marginTop: Spacing.medium,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSizeSmall,
              color: Colors.lightText,
            }}
          >
            {new Date(createdAt).toLocaleDateString(undefined, {
              weekday: "short", // e.g., "Thu"
              year: "numeric", // e.g., "2025"
              month: "long", // e.g., "August"
              day: "numeric", // e.g., "22"
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const EarnedBadgeCard = ({ data }) => {
  const navigation = useNavigation();
  const { badge, user: friend, createdAt } = data;

  const onClick = () => {
    try {
      navigation.navigate("Community", {
        screen: "FriendProfile",
        params: { friend, userId: friend.id, friendshipsStatus: "ACCEPTED" },
      });
    } catch (error) {}
  };

  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={{
          backgroundColor: Colors.white,
          borderRadius: 12,
          width: "100%",
          padding: Spacing.medium,
          marginBottom: Spacing.medium,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          flexDirection: "column",
        }}
      >
        {/* Name and avatar section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: Spacing.large,
          }}
        >
          {friend.photoUrl ? (
            <Avatars imageSource={friend.photoUrl} size={50} />
          ) : (
            <Icon name="person-circle-outline" size={50} color={Colors.gray} />
          )}
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSizeMedium,
                fontWeight: Typography.fontWeightBold,
                color: Colors.text,
                marginLeft: Spacing.medium,
                marginBottom: 3,
              }}
            >
              {friend.displayName}
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSizeSmall,
                color: Colors.lightText,
                marginLeft: Spacing.medium,
              }}
            >
              {friend.tagLine || ""}
            </Text>
          </View>
        </View>
        <AsyncImage
          source={badge.imageUrl}
          style={{
            alignSelf: "center",
            width: 50,
            height: 50,
            borderRadius: 0,

            marginBottom: Spacing.small,
          }}
        />
        <Text
          style={{
            fontSize: Typography.fontSizeMedium,
            fontWeight: Typography.fontFamilyMediumItalic,
            color: Colors.text,
          }}
        >
          Earned the{" "}
          <Text style={{ fontWeight: Typography.fontWeightBold }}>
            {badge.name}
          </Text>{" "}
          badge!
        </Text>

        {/* occured at date*/}
        <View
          style={{
            marginTop: Spacing.medium,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSizeSmall,
              color: Colors.lightText,
            }}
          >
            {new Date(createdAt).toLocaleDateString(undefined, {
              weekday: "short", // e.g., "Thu"
              year: "numeric", // e.g., "2025"
              month: "long", // e.g., "August"
              day: "numeric", // e.g., "22"
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// comments badge

export const CommentedCard = ({ data }) => {
  const navigation = useNavigation();
  const { user: friend, comment, challenge, createdAt } = data;

  const onClick = () => {
    try {
      navigation.navigate("Challenges", {
        screen: "ChallengeDetails",
        params: { challenge: challenge, activeTab: 2 },
      });
    } catch (error) {}
  };

  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={{
          backgroundColor: Colors.white,
          borderRadius: 12,
          width: "100%",
          padding: Spacing.medium,
          marginBottom: Spacing.medium,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          flexDirection: "column",
        }}
      >
        {/* Name and avatar section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: Spacing.large,
          }}
        >
          {friend.photoUrl ? (
            <Avatars imageSource={friend.photoUrl} size={50} />
          ) : (
            <Icon name="person-circle-outline" size={50} color={Colors.gray} />
          )}
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSizeMedium,
                fontWeight: Typography.fontWeightBold,
                color: Colors.text,
                marginLeft: Spacing.medium,
                marginBottom: 3,
              }}
            >
              {friend.displayName}
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSizeSmall,
                color: Colors.lightText,
                marginLeft: Spacing.medium,
              }}
            >
              {friend.tagLine || ""}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: Typography.fontSizeMedium,
            fontWeight: Typography.fontFamilyMediumItalic,
            color: Colors.text,
          }}
        >
          Commented on{" "}
          <Text style={{ fontWeight: Typography.fontWeightBold }}>
            {challenge.title}
          </Text>{" "}
          challenge!
        </Text>
        {/* comment */}
        <View
          style={{
            marginTop: Spacing.small,
            backgroundColor: Colors.lightGray,
            padding: Spacing.medium,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSizeSmall,
              color: Colors.lightText,
            }}
          >
            Commented: {comment?.content}
          </Text>
        </View>

        {/* occured at date*/}
        <View
          style={{
            marginTop: Spacing.medium,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSizeSmall,
              color: Colors.lightText,
            }}
          >
            {new Date(createdAt).toLocaleDateString(undefined, {
              weekday: "short", // e.g., "Thu"
              year: "numeric", // e.g., "2025"
              month: "long", // e.g., "August"
              day: "numeric", // e.g., "22"
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// challenge create card

export const ChallengeCreatedCard = ({ data }) => {
  const navigation = useNavigation();
  const { challenge, createdAt } = data;
  const onClick = () => {
    try {
      navigation.navigate("Challenges", {
        screen: "ChallengeDetails",
        params: { challenge: challenge },
      });
    } catch (error) {}
  };

  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={{
          backgroundColor: Colors.white,
          borderRadius: 12,
          width: "100%",
          padding: Spacing.medium,
          marginBottom: Spacing.medium,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            fontSize: Typography.fontSizeMedium,
            fontWeight: Typography.fontFamilyMediumItalic,
            color: Colors.text,
          }}
        >
          New challenge{" "}
          <Text style={{ fontWeight: Typography.fontWeightBold }}>
            {challenge.title}
          </Text>{" "}
          is <Text style={{ fontWeight: Typography.fontWeightBold }}>live</Text>
          !
        </Text>
        {challenge.imageUrl && (
          <AsyncImage
            source={challenge.imageUrl}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 0,
              marginTop: Spacing.small,
            }}
          />
        )}

        {/* occured at date*/}
        <View
          style={{
            marginTop: Spacing.medium,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSizeSmall,
              color: Colors.lightText,
            }}
          >
            {new Date(createdAt).toLocaleDateString(undefined, {
              weekday: "short", // e.g., "Thu"
              year: "numeric", // e.g., "2025"
              month: "long", // e.g., "August"
              day: "numeric", // e.g., "22"
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
