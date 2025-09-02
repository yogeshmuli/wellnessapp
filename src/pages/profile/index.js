import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { getUser, getOtherUser } from "../../redux/thunks/user";
import LoadingOverlay from "../../components/loadingOverlay";
import { useFocusEffect } from "@react-navigation/native";
import { Avatars } from "../../components/avatars";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { CustomEditableInput, MultiSelectInput } from "../../components/inputs";
import { Colors, Typography, Spacing } from "../../styles";
import { SolidButton } from "../../components/buttons";
import { Interests as InterestsConstant } from "../../constants/index";
import { updateUserProfile } from "../../redux/thunks/user";
import { logout } from "../../redux/thunks/auth";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
} from "../../redux/thunks/friends";

import SafeAreaView from "../../components/safearea";
import Store from "../../redux/store";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);
  const [isEditingView, setIsEditingView] = useState(false);
  const [isPersonalProfile, setIsPersonalProfile] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      // Fetch profile data when the screen is focused
      fetchProfile();
    }, [route.params?.userId])
  );
  useEffect(() => {
    if (!route.params?.userId) {
      setIsPersonalProfile(true);
    } else {
      setIsPersonalProfile(false);
    }
  }, [route.params]);

  // Fetch profile data here, e.g., using a Redux action
  const fetchProfile = async () => {
    try {
      setIsEditingView(false);
      let profileData;
      if (route.params?.userId) {
        setLoading(true);
        profileData = await dispatch(
          getOtherUser({ userId: route.params?.userId })
        ).unwrap();
        setProfile(profileData);
        setPickedImage(profileData.photoUrl || null);
        setLoading(false);
      } else {
        setLoading(false);
        // profileData = await dispatch(getUser()).unwrap();
        profileData = Store.getState().user.userData;
        setProfile(profileData);
        let updatedData = await dispatch(getUser()).unwrap();
        setProfile(updatedData);
        setPickedImage(profileData.photoUrl || null);
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch profile:", error);
    }
  };

  // save profile changes
  const saveProfileChanges = async () => {
    try {
      setLoading(true);

      const updatedProfile = {
        ...profile,
        photoUrl: pickedImage, // Assuming you want to save the picked image URL
      };
      await dispatch(updateUserProfile(updatedProfile)).unwrap();
      setLoading(false);
      setIsEditingView(false);
      console.log("Profile updated successfully:", updatedProfile);
    } catch (error) {
      setLoading(false);
      console.error("Failed to update profile:", error);
    }
  };
  const onConnect = async () => {
    try {
      setLoading(true);
      await dispatch(sendFriendRequest(profile.id)).unwrap();
      setLoading(false);
      console.log("Friend request sent successfully");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error("Failed to send friend request:", error);
    }
  };

  const onReject = async () => {
    try {
      setLoading(true);
      await dispatch(rejectFriendRequest(route.params?.friendshipId)).unwrap();
      setLoading(false);
      console.log("Friend request rejected successfully");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error("Failed to reject friend request:", error);
    }
  };

  const onAccept = async () => {
    try {
      setLoading(true);
      await dispatch(acceptFriendRequest(route.params?.friendshipId)).unwrap();
      setLoading(false);
      console.log("Friend request accepted successfully");
      navigation.navigate("FriendsList");
    } catch (error) {
      setLoading(false);
      console.error("Failed to accept friend request:", error);
    }
  };

  const onUnfriend = async () => {
    try {
      setLoading(true);
      await dispatch(unfriend(profile.id)).unwrap();
      setLoading(false);
      console.log("Unfriended successfully");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error("Failed to unfriend:", error);
    }
  };

  const onMessage = async () => {
    try {
      navigation.navigate("Chat", { friend: profile });
    } catch (error) {}
  };
  const onLogout = () => {
    dispatch(logout());
  };
  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
      });
      if (result.assets && result.assets.length > 0) {
        setPickedImage(result.assets[0].uri);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleOpenCamera = async () => {
    try {
      // setModalVisible(false);
      const result = await launchCamera({ mediaType: "photo" });
      if (result.assets && result.assets.length > 0) {
        setPickedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  };
  const getImageSource = () => {
    if (!pickedImage) {
      return null;
    }
    return { uri: pickedImage };
  };

  const mapMultiSelectOptions = (options) => {
    return options.map((option) => ({
      label: option,
      value: option,
    }));
  };

  const getButtonComponent = () => {
    if (isPersonalProfile && !isEditingView) {
      return (
        <View style={{ flexDirection: "column", width: "100%" }}>
          <SolidButton
            title="Edit Profile"
            style={{ marginTop: Spacing.large, width: "100%" }}
            onPress={() => setIsEditingView(true)}
          />
          <SolidButton
            title="Logout"
            style={{
              marginTop: Spacing.medium,
              width: "100%",
              backgroundColor: Colors.transparent,
              borderWidth: 2,
              borderColor: Colors.lightText,
              borderRadius: 12,
              borderStyle: "solid",
            }}
            textStyle={{
              color: Colors.lightText,
              fontFamily: Typography.fontFamilyMedium,
            }}
            onPress={onLogout}
          />
        </View>
      );
    }
    if (isPersonalProfile && isEditingView) {
      return (
        <SolidButton
          style={{ width: "100%" }}
          title="Save Changes"
          onPress={saveProfileChanges}
        />
      );
    }
    if (route.params?.friendshipsStatus === "PENDING-RECEIVED") {
      return (
        <View style={{ flexDirection: "column", width: "100%" }}>
          <SolidButton
            title="Accept"
            style={{ marginTop: Spacing.large, width: "100%" }}
            onPress={onAccept}
          />
          <SolidButton
            title="Reject"
            style={{
              marginTop: Spacing.medium,
              width: "100%",
              backgroundColor: Colors.transparent,
              borderWidth: 2,
              borderColor: Colors.lightText,
              borderRadius: 12,
              borderStyle: "solid",
            }}
            textStyle={{
              color: Colors.lightText,
              fontFamily: Typography.fontFamilyMedium,
            }}
            onPress={onReject}
          />
        </View>
      );
    }
    if (route.params?.friendshipsStatus === "PENDING-SENT") {
      return (
        <SolidButton
          title="Cancel Request"
          style={{ marginTop: Spacing.large, width: "100%" }}
          onPress={() => {
            onUnfriend();
          }}
        />
      );
    }
    if (route.params?.friendshipsStatus === "ACCEPTED") {
      return (
        <View style={{ flexDirection: "column", width: "100%" }}>
          <SolidButton
            title={"Message"}
            style={{ marginTop: Spacing.large, width: "100%" }}
            onPress={() => {
              onMessage();
            }}
          />
          <SolidButton
            title="Unfriend"
            style={{
              marginTop: Spacing.medium,
              width: "100%",
              backgroundColor: Colors.transparent,
              borderWidth: 2,
              borderColor: Colors.lightText,
              borderRadius: 12,
              borderStyle: "solid",
            }}
            textStyle={{
              color: Colors.lightText,
              fontFamily: Typography.fontFamilyMedium,
            }}
            onPress={() => {
              onUnfriend();
            }}
          />
        </View>
      );
    }

    return (
      <SolidButton
        title="Connect"
        style={{ marginTop: Spacing.large, width: "100%" }}
        onPress={onConnect}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LoadingOverlay visible={loading} />
      {/* Back Button */}
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
            {isPersonalProfile ? "My Profile" : "Profile"}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
            padding: Spacing.large,
          }}
        >
          {/* Avatar */}
          {pickedImage ? (
            <Avatars
              size={100}
              imageSource={getImageSource()}
              secondaryComponent={
                isEditingView
                  ? () => (
                      <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Icon name="camera" size={20} color="#fff" />
                      </TouchableOpacity>
                    )
                  : null
              }
            />
          ) : (
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={100}
                color={Colors.gray}
              />
              {isEditingView && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: Colors.primary,
                    borderRadius: 100 / 4,
                    padding: 8,
                  }}
                >
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Icon name="camera" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          {/* Name */}
          <CustomEditableInput
            disableEditing={isEditingView ? false : true}
            style={{
              marginTop: Spacing.large,
              paddingHorizontal: Spacing.medium,
            }}
            iconColor={Colors.black}
            textStyle={{
              fontSize: Typography.fontSizeLarge,

              color: Colors.text,
              fontFamily: Typography.fontFamilyBold,
            }}
            inputStyle={{
              fontSize: Typography.fontSizeLarge,

              color: Colors.text,
              fontFamily: Typography.fontFamilyBold,
            }}
            value={profile?.displayName}
            onChangeText={(text) => {
              setProfile({ ...profile, displayName: text });
            }}
          />
          {/* Tag line */}
          <CustomEditableInput
            disableEditing={isEditingView ? false : true}
            style={{
              marginTop: Spacing.medium,
              paddingHorizontal: Spacing.medium,
            }}
            iconColor={Colors.black}
            textStyle={{
              fontSize: Typography.fontSizeMedium,
              color: Colors.lightText,
            }}
            inputStyle={{
              fontSize: Typography.fontSizeMedium,
              color: Colors.lightText,
            }}
            value={profile?.tagLine}
            onChangeText={(text) => {
              setProfile({ ...profile, tagLine: text });
            }}
          />
          {/* Mutliselect  for interest*/}
          <View
            style={{
              alignSelf: "flex-start",
            }}
          >
            <MultiSelectInput
              disableEditing={isEditingView ? false : true}
              label={"Interests"}
              labelStyle={{
                fontSize: Typography.fontSizeMedium,
                color: Colors.text,
                fontFamily: Typography.fontFamilyMedium,
                marginBottom: Spacing.small,
              }}
              options={mapMultiSelectOptions(InterestsConstant)}
              onChange={(selectedItems) => {
                let updatedInterests = selectedItems.map((item) => item.value);
                setProfile({ ...profile, interests: updatedInterests });
              }}
              style={{
                marginTop: Spacing.medium,
                paddingHorizontal: Spacing.medium,
              }}
              selected={
                profile?.interests
                  ? mapMultiSelectOptions(profile.interests)
                  : []
              }
            />
          </View>
          {/* Ui for showing badges */}
          {/* label for badges */}
          <Text
            style={{
              fontSize: Typography.fontSizeMedium,
              color: Colors.text,
              fontFamily: Typography.fontFamilyMedium,
              marginTop: Spacing.medium,
              alignSelf: "flex-start",
            }}
          >
            Badges
          </Text>
          {profile?.badges && profile?.badges.length > 0 ? (
            <View
              style={{
                flexDirection: "row",

                flexWrap: "wrap",
                marginTop: Spacing.medium,
                justifyContent: "space-between",
                alignSelf: "flex-start",
              }}
            >
              <ScrollView
                style={{
                  maxHeight: 200,
                }}
                contentContainerStyle={{
                  flexDirection: "row",

                  flexWrap: "wrap",

                  justifyContent: "space-between",
                  alignSelf: "flex-start",

                  // minHeight: 100,
                  // width: "100%",
                }}
                vertical
              >
                {[...profile?.badges].map((badge, index) => {
                  // use Avatars to show images and text at bottom
                  return (
                    <View
                      key={index}
                      style={{
                        alignItems: "center",

                        width: 65,
                        marginRight: Spacing.small,
                      }}
                    >
                      <Avatars
                        key={index}
                        size={64}
                        nestedImageSize={24}
                        imageSource={{
                          uri: badge.imageUrl,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: Typography.fontSizeSmall,
                          color: Colors.text,
                          textAlign: "center",
                          marginVertical: Spacing.small,
                          fontFamily: Typography.fontFamilyRegular,
                        }}
                      >
                        {badge.name || "Badge Name"}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",

                marginTop: Spacing.medium,
                justifyContent: "center",
                alignSelf: "flex-start",
                alignItems: "center",
                minHeight: 100,
                width: "100%",
                backgroundColor: Colors.grayBg,
              }}
            >
              <Text
                style={{
                  fontFamily: Typography.fontFamilyRegular,
                  fontSize: Typography.fontSizeMedium,
                  color: Colors.lightText,
                }}
              >
                No badges earned yet
              </Text>
            </View>
          )}

          <View style={{ height: Spacing.xLarge }}></View>

          <View
            style={{
              width: "100%",
              bottom: 0,
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {getButtonComponent()}
          </View>

          {/* Modal for image options */}
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "flex-end",
              }}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 24,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}
                >
                  Select Image
                </Text>
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                  onPress={handlePickImage}
                >
                  <Text style={{ fontSize: 16 }}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                  onPress={handleOpenCamera}
                >
                  <Text style={{ fontSize: 16 }}>Open Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingVertical: 12 }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ fontSize: 16, color: "red" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
