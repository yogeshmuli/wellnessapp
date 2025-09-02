import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import SafeAreaView from "../../components/safearea";
import { Colors, Spacing, Typography } from "../../styles";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import {
  markNotificationAsRead,
  fetchNotifications,
} from "../../redux/thunks/notification";
import { useNavigation } from "@react-navigation/native";

const NotificationScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  const markAsRead = async (notification) => {
    try {
      await dispatch(markNotificationAsRead(notification.id)).unwrap();
      dispatch(fetchNotifications());
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatNotification = (notification) => {
    let type = notification.type;
    switch (type) {
      case "BADGE_EARNED":
        return (
          <Text style={{ fontFamily: Typography.fontFamilyRegular }}>
            You have earned a new badge!{" "}
            <Text
              style={{
                fontFamily: Typography.fontFamilyBold,
                color: Colors.primary,
              }}
            >
              {notification?.badge?.name}
            </Text>{" "}
          </Text>
        );
      case "MESSAGE":
        return (
          <Text style={{ fontFamily: Typography.fontFamilyRegular }}>
            You have a new message from{" "}
            <Text
              style={{
                fontFamily: Typography.fontFamilyBold,
                color: Colors.primary,
              }}
            >
              {notification?.friend?.displayName}
            </Text>
          </Text>
        );

      case "FRIEND_REQUEST_SENT":
        return (
          <Text style={{ fontFamily: Typography.fontFamilyRegular }}>
            You have a new friend request from{" "}
            <Text
              style={{
                fontFamily: Typography.fontFamilyBold,
                color: Colors.primary,
              }}
            >
              {notification?.friend?.displayName}
            </Text>
          </Text>
        );
      case "CHALLENGE_UPDATE":
        return (
          <Text style={{ fontFamily: Typography.fontFamilyRegular }}>
            Your challenge has been updated:{" "}
            <Text
              style={{
                fontFamily: Typography.fontFamilyBold,
                color: Colors.primary,
              }}
            >
              {notification?.challenge?.title}
            </Text>
          </Text>
        );
      default:
        return notification.content;
    }
  };

  const getIconForNotification = (type) => {
    switch (type) {
      case "BADGE_EARNED":
        return <Icon name="medal" size={24} color={Colors.info} />;
      case "MESSAGE":
        return (
          <Icon name="chatbubble-ellipses" size={24} color={Colors.success} />
        );
      case "FRIEND_REQUEST_SENT":
        return <Icon name="person-add" size={24} color={Colors.warning} />;
      case "CHALLENGE_UPDATE":
        return <Icon name="trophy" size={24} color="#000" />;
      default:
        return <Icon name="notifications-outline" size={24} color="#000" />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            display: "flex",
            marginTop: Spacing.medium,
            marginBottom: Spacing.large,
            paddingHorizontal: Spacing.large,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignSelf: "flex-start",
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="chevron-left" size={24} color={Colors.black} />

            <Text
              style={{
                fontSize: Typography.fontSizeLarge,
                fontWeight: "bold",
                marginLeft: Spacing.medium,
              }}
            >
              Notifications
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {notifications.length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: Spacing.large,
                  fontFamily: Typography.fontFamilyRegular,
                  fontSize: Typography.fontSizeMedium,
                }}
              >
                No new notifications
              </Text>
            )}
            {notifications.map((notification, index) => (
              <View
                key={index}
                style={{
                  padding: Spacing.small,
                  display: "flex",
                  flexDirection: "row",
                  // height: 60,
                  marginHorizontal: Spacing.medium,
                  marginVertical: Spacing.small,
                }}
              >
                {/* Icons */}
                <View
                  style={{
                    height: 60,
                    width: 60,
                    marginRight: Spacing.medium,
                    backgroundColor: Colors.white,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 2,
                    shadowColor: Colors.black,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                  }}
                >
                  {getIconForNotification(notification?.type)}
                </View>
                {/* notification text and time */}
                <View style={{ flex: 1, flexDirection: "column" }}>
                  {formatNotification(notification)}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Typography.fontSizeSmall,
                        color: Colors.gray,
                        marginTop: Spacing.xSmall,
                      }}
                    >
                      {new Date(notification.createdAt).toLocaleDateString(
                        undefined,
                        {
                          weekday: "short", // e.g., "Thu"
                          year: "numeric", // e.g., "2025"
                          month: "long", // e.g., "August"
                          day: "numeric", // e.g., "22"
                        }
                      )}
                    </Text>
                    {notification.isRead ? null : (
                      <TouchableOpacity
                        onPress={() => markAsRead(notification)}
                      >
                        <Text
                          style={{
                            color: Colors.primary,
                            fontFamily: Typography.fontFamily,
                          }}
                        >
                          Mark as Read
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
