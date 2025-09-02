import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";

import { Colors, Spacing, Typography } from "../../styles"; // Adjust the import path as necessary
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

// Friends List Component
const FriendsList = () => {
  const userReducer = useSelector((state) => state.user);
  const friendsReducer = useSelector((state) => state.friends);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [friendships, setFriendships] = React.useState(
    friendsReducer.friendsList
  );

  const pageMountedRef = React.useRef(false);
  const { socket } = useSocket();
  const [friendRequests, setFriendRequests] = React.useState(
    friendsReducer.friendRequests
  );
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      pageMountedRef.current = true;
    }, 1000);
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
      fetchFriendsWithOutLoading();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <LoadingOverlay visible={loading} />
      <View
        style={{
          display: "flex",
          marginTop: Spacing.medium,
          marginBottom: Spacing.large,
          paddingHorizontal: Spacing.large,
          flexDirection: "row",
          justifyContent: "space-between",
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        <Text
          style={{ fontSize: Typography.fontSizeLarge, fontWeight: "bold" }}
        >
          Community
        </Text>
        {/* search and filter */}
        <View style={{ flexDirection: "row", marginLeft: "auto" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search" size={28} color={Colors.gray} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: Spacing.medium }}>
            <Ionicons name="filter" size={28} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
      {friendships.length === 0 && friendRequests.length === 0 ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.white,
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
            paddingHorizontal: Spacing.large,
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
                          fontWeight: "bold",
                          marginBottom: Spacing.small,
                          color: Colors.textPrimary,
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
                            alignItems: "center",
                            paddingVertical: Spacing.small,

                            borderBottomWidth: 1,
                            borderBottomColor: Colors.lightGray,

                            height: 97,
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
                              color={Colors.gray}
                            />
                          )}
                          {/* name and tagline */}
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
                                fontSize: Typography.fontSizeMedium,
                                color: Colors.text,
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
                            <TouchableOpacity
                              style={{
                                paddingHorizontal: Spacing.small,
                                paddingVertical: Spacing.small,
                                borderRadius: Spacing.small,
                              }}
                              onPress={() =>
                                navigation.navigate("FriendProfile", {
                                  userId: request?.friend?.id,
                                  friendshipsStatus: request.friendshipStatus,
                                  friendshipId: request.id,
                                })
                              }
                            >
                              <Ionicons
                                name="eye-outline"
                                size={24}
                                color={Colors.text}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => onAccept(request.id)}
                              style={{
                                paddingHorizontal: Spacing.small,
                                paddingVertical: Spacing.small,
                                borderRadius: Spacing.small,
                              }}
                            >
                              <Ionicons
                                name="checkmark-circle-outline"
                                size={24}
                                color={Colors.primary}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                paddingHorizontal: Spacing.small,
                                paddingVertical: Spacing.small,
                                borderRadius: Spacing.small,
                                marginLeft: Spacing.small,
                              }}
                              onPress={() => onReject(request.friend.id)}
                            >
                              <Ionicons
                                name="close-circle-outline"
                                size={24}
                                color={Colors.red}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text
                    style={{
                      fontSize: Typography.fontSizeMedium,
                      fontWeight: "bold",
                      marginBottom: Spacing.small,
                      color: Colors.textPrimary,
                      fontFamily: Typography.fontFamilyBold,
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
                  borderBottomColor: Colors.lightGray,

                  height: 97,
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
                    color={Colors.gray}
                  />
                )}
                {/* name and tagline */}
                <TouchableOpacity
                  style={{
                    paddingHorizontal: Spacing.small,
                    paddingVertical: Spacing.small,
                    borderRadius: Spacing.small,
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
                        fontSize: Typography.fontSizeMedium,
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
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Chat", {
                        friend: friendship?.friend,
                      })
                    }
                    style={{
                      paddingHorizontal: Spacing.small,
                      paddingVertical: Spacing.small,
                      borderRadius: Spacing.small,
                    }}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={24}
                      color={Colors.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default FriendsList;
