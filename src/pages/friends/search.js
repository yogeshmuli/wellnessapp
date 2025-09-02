import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import Input from "../../components/inputs";
import Icon from "react-native-vector-icons/FontAwesome5";

import { Colors, Spacing, Typography } from "../../styles"; // Adjust the import path as necessary
import Ionicons from "react-native-vector-icons/Ionicons";
import LoadingOverlay from "../../components/loadingOverlay";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { searchFriends } from "../../redux/thunks/friends"; // Adjust the import path as necessary
import { Avatars } from "../../components/avatars";
import { useFocusEffect } from "@react-navigation/native";
import SafeAreaView from "../../components/safearea";

// Friends List Component
const FriendSearch = () => {
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const inputRef = React.useRef(null);
  const searchQueryRef = useRef(searchQuery);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep the ref updated with the latest searchQuery
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await dispatch(
            searchFriends(searchQueryRef.current)
          ).unwrap();
          setUsers(response);
        } catch (error) {
          console.error("Error fetching friends:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await dispatch(searchFriends(searchQuery)).unwrap();
    } catch (error) {
      console.error("Error refreshing friends list:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onSearchFriends = async () => {
    try {
      setLoading(true);
      const response = await dispatch(searchFriends(searchQuery)).unwrap();
      setUsers(response);
    } catch (error) {
      console.error("Error searching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <LoadingOverlay visible={loading} />
      <View
        style={{
          padding: Spacing.medium,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color={Colors.black} />
          <Text
            style={{
              fontSize: Typography.fontSizeLarge,
              fontWeight: "bold",
              marginLeft: Spacing.small,
            }}
          >
            Search Friends
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View
        style={{
          paddingHorizontal: Spacing.medium,
        }}
      >
        <Input
          ref={inputRef}
          placeholder="Search by name, username or email"
          leftIcon={<Ionicons name="search" size={24} color={Colors.gray} />}
          value={searchQuery}
          containerStyle={{
            marginBottom: Spacing.medium,
            backgroundColor: Colors.grayBg,
            borderRadius: 999,
          }}
          style={{
            backgroundColor: Colors.grayBg,
            borderRadius: 999,
            fontSize: Typography.fontSizeMedium,
            fontFamily: Typography.fontFamilyRegular,
            borderWidth: 0,
          }}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={() => onSearchFriends()}
        />
      </View>
      {/* Friends List */}

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
        <ScrollView
          contentContainerStyle={{
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",

            // backgroundColor: "red",
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              titleColor={Colors.primary}
              title="Refreshing..."
            ></RefreshControl>
          }
        >
          {users.length > 0 ? (
            users.map((user) => (
              <TouchableOpacity
                key={user.id}
                onPress={() =>
                  navigation.navigate("FriendProfile", {
                    userId: user.id,
                    friendshipsStatus: user.friendshipStatus,
                    friendshipId: user.friendshipId ?? null,
                  })
                }
              >
                <View
                  key={user?.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: Spacing.small,

                    borderBottomWidth: 1,
                    borderBottomColor: Colors.lightGray,

                    height: 97,
                  }}
                >
                  {user.photoUrl ? (
                    <Avatars imageSource={{ uri: user.photoUrl }} size={60} />
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
                      {user?.displayName}
                    </Text>
                    <Text
                      style={{
                        marginLeft: Spacing.small,
                        fontSize: 14,
                        color: Colors.gray,
                      }}
                    >
                      {user.tagline ?? "No tagline"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: Colors.gray }}>
              No friends found.
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FriendSearch;
