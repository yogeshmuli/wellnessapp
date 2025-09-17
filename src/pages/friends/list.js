import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import Text from "../../components/text";

import { Spacing, Typography } from "../../styles"; // Adjust the import path as necessary
import Ionicons from "react-native-vector-icons/Ionicons";
import LoadingOverlay from "../../components/loadingOverlay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriendsList,
  fetchFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
} from "../../redux/thunks/friends"; // Adjust the import path as necessary
import { Avatars } from "../../components/avatars";
import { useSocket } from "../../hooks/useSocket";
import SafeAreaView from "../../components/safearea";
import { SolidButton } from "../../components/buttons";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useTheme } from "../../hooks/useTheme";

// Friends List Component
const FriendsList = () => {
  const userReducer = useSelector((state) => state.user);
  const friendsReducer = useSelector((state) => state.friends);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [friendships, setFriendships] = React.useState(
    friendsReducer.friendsList
  );

  const { socket } = useSocket();
  const [friendRequests, setFriendRequests] = React.useState(
    friendsReducer.friendRequests
  );
  const navigation = useNavigation();
  const { Colors } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("notification", (notification) => {
      let type = notification.type;
      switch (type) {
        case "friend_request_received":
        case "friend_request_accepted":
        case "unfriend":
        case "friend_request_canceled":
          fetchFriends();
          break;

        default:
          break;
      }
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchFriends();
    }, [])
  );

  const fetchFriendsWithOutLoading = async () => {
    try {
      const response = await dispatch(fetchFriendsList()).unwrap();
      const requestsResponse = await dispatch(fetchFriendRequests()).unwrap();
      setFriendships(response);
      setFriendRequests(requestsResponse);
    } catch (error) {
      throw error;
    }
  };

  const fetchFriends = async () => {
    try {
      setLoading(true);
      await fetchFriendsWithOutLoading();
    } catch (error) {
      console.error("Error fetching friends list:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await dispatch(fetchFriendsList()).unwrap();
      const requestsResponse = await dispatch(fetchFriendRequests()).unwrap();
      setFriendships(response);
      setFriendRequests(requestsResponse);
    } catch (error) {
      console.error("Error refreshing friends list:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onAccept = async (requestId) => {
    try {
      setLoading(true);
      await dispatch(acceptFriendRequest(requestId)).unwrap();
      console.log("Friend request accepted");
      fetchFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setLoading(false);
    }
  };
  const onReject = async (friendId) => {
    try {
      setLoading(true);
      await dispatch(unfriend(friendId)).unwrap();
      console.log("Friend request rejected");
      fetchFriends();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackground }}>
      <LoadingOverlay visible={loading && friendships.length === 0} />
      <View style={{ flex: 1, paddingHorizontal: 17.5 }}>
        <View
          style={{
            display: "flex",
            marginTop: Spacing.medium,
            marginBottom: Spacing.large,

            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="chevron-left" size={24} color={Colors.text} />
            <View style={{ width: Spacing.small }} />
            <Text
              style={{
                fontSize: Typography.fontSizeLarge,
                fontFamily: Typography.fontFamilyBold,
                padding: 0,
              }}
            >
              Community
            </Text>
          </TouchableOpacity>
          {/* search and filter */}
          <View
            style={{
              flexDirection: "row",
              marginLeft: "auto",
              alignItems: "center",
            }}
          >
            <SolidButton
              title={"Explore"}
              icon={
                <View style={{ marginRight: Spacing.small }}>
                  <Ionicons name="search" size={20} color={Colors.white} />
                </View>
              }
              style={{
                height: 40,
                fontSize: 16,
                paddingHorizontal: Spacing.medium,
                paddingVertical: Spacing.small,
                backgroundColor: Colors.info,
              }}
              onPress={() => navigation.navigate("Search")}
            />
          </View>
        </View>
        {friendships.length === 0 && friendRequests.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",

              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSizeMedium,
                color: Colors.textSecondary,
              }}
            >
              No friends found. Start adding friends!
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,

              paddingBottom: Spacing.medium,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "stretch",
            }}
          >
            <FlatList
              contentContainerStyle={{}}
              ListHeaderComponent={() => {
                return (
                  <>
                    {friendRequests.length > 0 && (
                      <View>
                        {/* Friend Requests section */}
                        <Text
                          style={{
                            fontSize: Typography.fontSizeMedium,
                            fontFamily: Typography.fontFamilyBold,
                            marginBottom: Spacing.small,
                            color: Colors.text,
                            fontFamily: Typography.fontFamilyBold,
                          }}
                        >
                          Requests
                        </Text>
                        {friendRequests.map((request) => (
                          <View
                            key={request.id}
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-start",
                              paddingVertical: Spacing.small,

                              borderBottomWidth: 1,
                              borderBottomColor: Colors.lightBorder,
                            }}
                          >
                            {request?.friend?.photoUrl ? (
                              <Avatars
                                imageSource={{ uri: request?.friend?.photoUrl }}
                                size={60}
                              />
                            ) : (
                              <Ionicons
                                name="person-circle-outline"
                                size={60}
                                color={Colors.text}
                              />
                            )}
                            {/* name and tagline */}
                            <View
                              style={{
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                flex: 1,
                              }}
                            >
                              <Text
                                style={{
                                  marginLeft: Spacing.small,
                                  fontSize: 16,
                                  color: Colors.text,

                                  fontFamily: Typography.fontFamilyBold,
                                }}
                              >
                                {request?.friend?.displayName}
                              </Text>
                              <Text
                                style={{
                                  marginLeft: Spacing.small,
                                  fontSize: 14,
                                  color: Colors.gray,
                                }}
                              >
                                {request?.friend?.tagLine ?? "No tagline"}
                              </Text>
                            </View>
                            {/* action buttons */}
                            <View
                              style={{
                                flexDirection: "row",
                                marginLeft: "auto",
                                alignItems: "center",
                              }}
                            >
                              <SolidButton
                                title={"Respond"}
                                icon={
                                  <View style={{ marginRight: Spacing.small }}>
                                    <Ionicons
                                      name="person-add"
                                      size={20}
                                      color={Colors.white}
                                    />
                                  </View>
                                }
                                style={{
                                  height: 50,
                                  fontSize: 16,
                                  paddingHorizontal: Spacing.medium,
                                  paddingVertical: Spacing.small,
                                  backgroundColor: Colors.primary,
                                }}
                                onPress={() =>
                                  navigation.navigate("FriendProfile", {
                                    userId: request?.friend?.id,
                                    friendshipsStatus: request.friendshipStatus,
                                    friendshipId: request.id,
                                  })
                                }
                              />
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                    <Text
                      style={{
                        fontSize: Typography.fontSizeMedium,
                        fontFamily: Typography.fontFamilyBold,
                        marginBottom: Spacing.small,
                        color: Colors.text,
                        fontFamily: Typography.fontFamilyBold,
                        marginTop:
                          friendRequests.length > 0 ? Spacing.medium : 0,
                      }}
                    >
                      Friends
                    </Text>
                  </>
                );
              }}
              data={friendships}
              renderItem={({ item: friendship }) => (
                <View
                  key={friendship?.friend?.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: Spacing.small,

                    borderBottomWidth: 1,
                    borderBottomColor: Colors.lightBorder,
                  }}
                >
                  {friendship?.friend?.photoUrl ? (
                    <Avatars
                      imageSource={{ uri: friendship?.friend?.photoUrl }}
                      size={60}
                    />
                  ) : (
                    <Ionicons
                      name="person-circle-outline"
                      size={60}
                      color={Colors.text}
                    />
                  )}
                  {/* name and tagline */}
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 0,
                    }}
                    onPress={() =>
                      navigation.navigate("FriendProfile", {
                        userId: friendship?.friend?.id,
                        friendshipsStatus: friendship.friendshipStatus,
                        friendshipId: friendship.id,
                      })
                    }
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: Spacing.small,
                          fontSize: 16,
                          // fontWeight: "bold",
                          fontFamily: Typography.fontFamilyBold,
                          color: Colors.text,
                        }}
                      >
                        {friendship?.friend?.displayName}
                      </Text>
                      <Text
                        style={{
                          marginLeft: Spacing.small,
                          fontSize: 14,
                          color: Colors.gray,
                        }}
                      >
                        {friendship?.friend?.tagLine ?? "No tagline"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* action buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: "auto",
                      alignItems: "center",
                    }}
                  >
                    <SolidButton
                      title={"Chat"}
                      icon={
                        <View style={{ marginRight: Spacing.small }}>
                          <Ionicons
                            name="chatbubbles"
                            size={20}
                            color={Colors.white}
                          />
                        </View>
                      }
                      style={{
                        height: 50,
                        fontSize: 16,
                        paddingHorizontal: Spacing.medium,
                        paddingVertical: Spacing.small,
                        backgroundColor: Colors.primary,
                      }}
                      onPress={() =>
                        navigation.navigate("Chat", {
                          friend: friendship?.friend,
                        })
                      }
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FriendsList;
