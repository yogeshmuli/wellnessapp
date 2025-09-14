import React, { useEffect, useState, useCallback, use } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Text from "../../components/text";
import { logout } from "../../redux/thunks/auth";
import {
  getUser,
  getUserFeed,
  getUserLeaderboard,
} from "../../redux/thunks/user";
import { useDispatch, useSelector } from "react-redux";

import { Avatars } from "../../components/avatars";
import { Spacing, Typography } from "../../styles";
import Icon from "react-native-vector-icons/Ionicons";
import ProgressBar from "../../components/progressbar";
import LoadingOverlay from "../../components/loadingOverlay";
import { fetchNotifications } from "../../redux/thunks/notification";
import {
  getColorByFocusArea,
  getIconByFocusArea,
  toTitleCase,
} from "../../utils/helpers";

import SafeAreaView from "../../components/safearea";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwsomeIcon5 from "react-native-vector-icons/FontAwesome5";
import { useTheme } from "../../hooks/useTheme";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { Colors } = useTheme();

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
        <Icon name="notifications" size={30} color={Colors.primary} />
        {unreadCount > 0 && (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              backgroundColor: Colors.info,
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
                paddingHorizontal: 0,
                paddingVertical: 0,
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
  const habitsReducerData = useSelector((state) => state.habits.habits);
  const [refreshing, setRefreshing] = useState(false);
  const [userDetails, setUserDetails] = useState(reducerData.userData);

  const [userFeed, setUserFeed] = useState(reducerData.userFeed);
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const navigation = useNavigation();
  const { Colors, changeTheme } = useTheme();

  useEffect(() => {
    fetchDataWithLoading();
  }, []);

  const fetchDataWithLoading = async () => {
    setLoading(true);
    await getUserDetails();
    await getUserFeedDetails();
    await getLeaderboardDetails();
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

  const getLeaderboardDetails = async () => {
    try {
      let leaderboardData = await dispatch(getUserLeaderboard()).unwrap();
      // Do something with leaderboardData if needed
      console.log("Leaderboard data fetched successfully:", leaderboardData);
      setUserLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
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

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  const activeHabits = habitsReducerData
    .filter((habit) => habit.habitStatus === "ENROLLED")
    .splice(0, 2);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackground }}>
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

              opacity: 0.8,
              zIndex: 9,
            }}
          >
            <ActivityIndicator />
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 16,
            paddingHorizontal: 17.5,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Avatar */}
          <TouchableOpacity
            onPress={() => {
              changeTheme();
            }}
          >
            {userDetails?.photoUrl ? (
              <Avatars imageSource={userDetails.photoUrl} size={50} />
            ) : (
              <Icon
                name="person-circle-outline"
                size={50}
                color={Colors.text}
              />
            )}
          </TouchableOpacity>
          {/* greeting div */}
          <View>
            <Text
              style={{
                fontSize: 20,
                lineHeight: 32,
                fontWeight: Typography.fontWeightBold,
                color: Colors.text,
                fontFamily: Typography.fontFamilyBold,
                marginBottom: 4,
                padding: 0,
              }}
            >
              {`${getGreeting()} , `}
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 32,
                  fontWeight: Typography.fontWeightBold,
                  color: Colors.text,
                  fontFamily: Typography.fontFamilyBold,
                  marginBottom: 4,
                  padding: 0,
                  color: Colors.primary,
                }}
              >
                {userDetails?.displayName.split(" ")[0] ?? ""}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: Typography.fontFamilyRegular,
                color: Colors.lightText,

                padding: 0,
              }}
            >
              Stay disciplined. Stay relentless.
            </Text>
          </View>

          {/* Notification */}
          <NotificationComponent />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,

              alignItems: "center",
              flexDirection: "column",
              justifyContent: "flex-start",

              paddingHorizontal: 17.5,

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
              <View>
                {/* header */}

                {/* Quote */}
                <View
                  style={{
                    marginTop: Spacing.large,
                    padding: Spacing.large,
                    backgroundColor: Colors.cardBackground,
                    borderRadius: 8,
                    width: "100%",
                    height: 128,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: Colors.lightText,
                      fontFamily: Typography.fontFamilyRegular,
                    }}
                  >
                    Brotherhood Philosophy
                  </Text>
                </View>
                {/* master you life */}
                <View
                  style={{
                    marginTop: Spacing.small,
                    marginBottom: Spacing.small,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 28,
                      fontFamily: Typography.fontFamilyMedium,
                      color: Colors.text,
                    }}
                  >
                    Master Your Life
                  </Text>
                  {
                    <View style={{ flexDirection: "row" }}>
                      {["Health", "Growth", "Relationships", "Wealth"].map(
                        (item, index) => (
                          <Text
                            key={index}
                            style={{
                              fontSize: 14,
                              color: Colors.textPrimary,
                              fontFamily: Typography.fontFamilyRegular,
                              color: Colors.lightText,
                            }}
                          >
                            {item}
                          </Text>
                        )
                      )}
                    </View>
                  }
                </View>

                {/* Profile Progress */}
                <View
                  style={{
                    backgroundColor: Colors.cardBackground,

                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingTop: Spacing.medium,
                    paddingBottom: Spacing.medium,
                    paddingHorizontal: 17,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: Colors.lightText,
                      paddingTop: 0,
                      alignSelf: "flex-start",
                    }}
                  >
                    Your Progress
                  </Text>
                  {/* row 1 */}
                  <View
                    style={{
                      flexDirection: "row",

                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.lightText,
                          fontSize: 24,
                          paddingBottom: 2,
                        }}
                      >
                        {userDetails?.highestStreak || 0}
                      </Text>
                      <Text
                        style={{
                          color: Colors.lightText,
                          fontSize: 14,
                        }}
                      >
                        Day Streak
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.lightText,
                          fontSize: 24,
                          paddingBottom: 2,
                        }}
                      >
                        {userDetails?.points || 0}
                      </Text>
                      <Text
                        style={{
                          color: Colors.lightText,
                          fontSize: 14,
                        }}
                      >
                        Total Points
                      </Text>
                    </View>
                  </View>
                </View>
                {/* FocusAreas progress */}
                {userDetails?.focusAreaProgress &&
                  userDetails?.focusAreaProgress.length > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        marginTop: Spacing.small,
                        marginBottom: Spacing.small,
                      }}
                    >
                      {userDetails?.focusAreaProgress.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            height: 110,
                            width: 171,
                            marginTop: Spacing.medium,
                            flexDirection: "column",

                            alignItems: "center",
                            marginBottom: Spacing.medium,
                            backgroundColor: Colors.cardBackground,
                            borderRadius: 8,
                            paddingHorizontal: Spacing.medium,
                          }}
                        >
                          {/* Row 1 */}
                          <View
                            style={{
                              marginTop: Spacing.medium,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <FontAwsomeIcon5
                              name={getIconByFocusArea(item.name)}
                              size={30}
                              color={getColorByFocusArea(item.name)}
                            />
                            <Text
                              style={{
                                backgroundColor: getColorByFocusArea(item.name),
                                color: Colors.white,
                                fontFamily: Typography.fontFamilyBold,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 4,
                                fontSize: 12,
                              }}
                            >
                              {parseInt(item.totalProgress) || 0}%
                            </Text>
                          </View>
                          {/* name */}
                          <Text
                            style={{
                              color: Colors.text,
                              fontFamily: Typography.fontFamilyMedium,
                              fontSize: 14,
                              paddingHorizontal: 0,

                              alignSelf: "flex-start",
                            }}
                          >
                            {toTitleCase(item.label)}
                          </Text>
                          {/* progress */}
                          <View style={{ width: "100%" }}>
                            <ProgressBar
                              progress={parseInt(item.totalProgress) || 0}
                              color={getColorByFocusArea(item.name)}
                              height={8}
                            />
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
              </View>

              {/* Active Habits */}
              {activeHabits.length > 0 && (
                <View
                  style={{
                    marginBottom: Spacing.small,
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      paddingTop: 0,
                      paddingBottom: Spacing.small,
                      fontFamily: Typography.fontFamilyMedium,
                    }}
                  >
                    Active Habits
                  </Text>
                  {activeHabits.map((habit, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor: Colors.cardBackground,
                        width: "100%",
                        padding: Spacing.medium,
                        borderRadius: 8,
                        marginTop: Spacing.small,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      onPress={() => {
                        navigation.navigate("Habits");
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        <FontAwsomeIcon5
                          name={getIconByFocusArea(habit.focusArea.name)}
                          size={20}
                          color={Colors.white}
                          style={{
                            backgroundColor: getColorByFocusArea(
                              habit.focusArea.name
                            ),
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            marginRight: Spacing.medium,
                            textAlign: "center",
                            paddingTop: 10,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Typography.fontFamilyMedium,
                            color: Colors.text,
                            paddingVertical: 0,
                            paddingHorizontal: Spacing.medium,
                          }}
                        >
                          {habit.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {/* leaderbords */}
              {userLeaderboard && userLeaderboard.length > 0 && (
                <View
                  style={{
                    marginBottom: Spacing.small,
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      paddingTop: 0,
                      paddingBottom: Spacing.small,
                      fontFamily: Typography.fontFamilyMedium,
                    }}
                  >
                    Leaderboard
                  </Text>
                  {userLeaderboard.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: Colors.cardBackground,
                        width: "100%",
                        paddingVertical: Spacing.medium,
                        paddingHorizontal: Spacing.small,
                        borderRadius: 8,
                        marginTop: Spacing.small,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Typography.fontFamilyMedium,
                            color: Colors.text,
                            paddingVertical: 0,
                            paddingHorizontal: Spacing.small,
                          }}
                        >
                          {index + 1}.
                        </Text>
                        {item.photoUrl ? (
                          <Avatars imageSource={item.photoUrl} size={40} />
                        ) : (
                          <Icon
                            name="person-circle-outline"
                            size={40}
                            color={Colors.text}
                          />
                        )}
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Typography.fontFamilyMedium,
                            color: Colors.text,
                            paddingVertical: 0,
                            paddingHorizontal: Spacing.medium,
                          }}
                        >
                          {item.displayName}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: Typography.fontFamilyMedium,
                          color: Colors.text,
                          paddingVertical: 0,
                          paddingHorizontal: Spacing.medium,
                        }}
                      >
                        {item.points} pts
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;
