import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { logout } from "../../redux/thunks/auth";
import { getUser, getUserFeed } from "../../redux/thunks/user";
import { useDispatch, useSelector } from "react-redux";

import { Avatars } from "../../components/avatars";
import { Colors, Spacing, Typography } from "../../styles";
import Icon from "react-native-vector-icons/Ionicons";
import {
  FriendJoinedCard,
  EarnedBadgeCard,
  CommentedCard,
  ChallengeCreatedCard,
} from "./cards";
import LoadingOverlay from "../../components/loadingOverlay";
import { fetchNotifications } from "../../redux/thunks/notification";

import SafeAreaView from "../../components/safearea";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchNotificationsData();
    }, [])
  );

  const fetchNotificationsData = async () => {
    try {
      const data = await dispatch(fetchNotifications()).unwrap();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return (
    <TouchableOpacity
      style={{
        alignSelf: "center",
      }}
      onPress={() => navigation.navigate("Notifications")}
    >
      <View
        style={{
          width: 40,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="notifications-outline" size={30} color={Colors.lightText} />
        {unreadCount > 0 && (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              backgroundColor: Colors.primary,
              borderRadius: 12,
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontFamily: Typography.fontFamilyBold,
              }}
            >
              {unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const reducerData = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [userDetails, setUserDetails] = useState(reducerData.userData);
  const [userFeed, setUserFeed] = useState(reducerData.userFeed);

  useEffect(() => {
    fetchDataWithLoading();
  }, []);

  const fetchDataWithLoading = async () => {
    setLoading(true);
    await getUserDetails();
    await getUserFeedDetails();
    setLoading(false);
  };

  const getUserFeedDetails = async () => {
    try {
      let userFeed = await dispatch(getUserFeed()).unwrap();
      // Do something with userFeed if needed
      console.log("User feed fetched successfully:", userFeed);
      setUserFeed(userFeed);
    } catch (error) {
      console.error("Failed to fetch user feed:", error);
    }
  };

  const getUserDetails = async () => {
    try {
      let userDetails = await dispatch(getUser()).unwrap();

      setUserDetails(userDetails);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    console.log("Refreshing user details...");
    setRefreshing(true);
    await getUserDetails();
    await getUserFeedDetails();
    setRefreshing(false);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  const renderFeed = () => {
    return (
      <>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 24,
          }}
          ListHeaderComponent={() => (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  marginTop: 16,
                  justifyContent: "space-between",
                }}
              >
                {/* Avatar */}
                <TouchableOpacity onPress={() => {}}>
                  {userDetails?.photoUrl ? (
                    <Avatars imageSource={userDetails.photoUrl} size={50} />
                  ) : (
                    <Icon
                      name="person-circle-outline"
                      size={50}
                      color={Colors.gray}
                    />
                  )}
                </TouchableOpacity>
                {/* greeting div */}
                <View>
                  <Text
                    style={{
                      fontSize: Typography.fontSizeLarge,
                      fontWeight: Typography.fontWeightBold,
                      color: Colors.text,
                      fontFamily: Typography.fontFamilyBold,
                    }}
                  >
                    {`${getGreeting()} , ${
                      userDetails?.displayName.split(" ")[0] ?? ""
                    }`}
                  </Text>
                  <Text
                    style={{
                      fontSize: Typography.fontSizeMedium,
                      color: Colors.lightText,
                    }}
                  >
                    Start your wellness journey
                  </Text>
                </View>

                {/* Notification */}
                <NotificationComponent />
              </View>
              {/* Quote */}
              <View
                style={{
                  marginTop: Spacing.large,
                  padding: Spacing.large,
                  backgroundColor: Colors.lightGray,
                  borderRadius: 12,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: Typography.fontSizeMedium,
                    color: Colors.lightText,
                    fontFamily: Typography.fontFamilyRegular,
                    fontStyle: "italic",
                  }}
                >
                  "Small steps every day lead to big changes."
                </Text>
              </View>
            </View>
          )}
          windowSize={2}
          removeClippedSubviews={true}
          style={{ paddingBottom: 50 }}
          data={userFeed}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          initialNumToRender={2}
          renderItem={({ item, index }) => {
            if (item.type === "FRIEND_JOINED") {
              return <FriendJoinedCard data={item} />;
            }
            if (item.type === "BADGE_EARNED") {
              return <EarnedBadgeCard data={item} />;
            }
            if (item.type === "COMMENT") {
              return <CommentedCard data={item} />;
            }
            if (item.type === "CHALLENGE_CREATED") {
              return <ChallengeCreatedCard data={item} />;
            }
          }}
        />
      </>
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        {/* <LoadingOverlay visible={loading} /> */}
        {loading && userFeed.length === 0 && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.white,
              opacity: 0.8,
              zIndex: 9,
            }}
          >
            <ActivityIndicator />
          </View>
        )}

        <View
          style={{
            flex: 1,

            alignItems: "center",
            flexDirection: "column",
            justifyContent: "flex-start",
            backgroundColor: Colors.white,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
            }}
          >
            {renderFeed()}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Home;
