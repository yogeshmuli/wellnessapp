import React, { useEffect, useState } from "react";
import { View, Modal, TouchableOpacity, ScrollView } from "react-native";
import Text from "../../components/text";
import { useDispatch } from "react-redux";
import { getUser, getOtherUser } from "../../redux/thunks/user";
import LoadingOverlay from "../../components/loadingOverlay";
import { useFocusEffect } from "@react-navigation/native";
import { Avatars } from "../../components/avatars";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import {
  CustomEditableInput,
  CustomInput,
  SelectInput,
} from "../../components/inputs";
import { Typography, Spacing } from "../../styles";
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
import ProgressBar from "../../components/progressbar";
import { getColorByFocusArea } from "../../utils/helpers";
import { useTheme } from "../../hooks/useTheme";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);
  const [isEditingView, setIsEditingView] = useState(false);
  const [isPersonalProfile, setIsPersonalProfile] = useState(false);
  const [theme, setTheme] = useState({
    label: "Light",
    value: "light",
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { Colors, getActiveTheme, changeTheme } = useTheme();

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
    getActiveTheme().then((themePreference) => {
      setTheme({
        label: themePreference === "dark" ? "Dark" : "Light",
        value: themePreference,
      });
    });
  }, [route.params]);

  // Handle theme change

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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    changeTheme(newTheme.value);
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
            icon={
              <Ionicons
                name="log-out"
                size={16}
                color={Colors.text}
                style={{ marginRight: 8 }}
              />
            }
            title="Logout"
            style={{
              marginTop: Spacing.medium,
              width: "100%",
              backgroundColor: Colors.error,
              borderWidth: 0,

              borderRadius: 12,
            }}
            textStyle={{
              color: Colors.text,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackground }}>
      <LoadingOverlay visible={loading} />
      <View style={{ flex: 1, width: "100%", paddingHorizontal: 17.5 }}>
        {/* Back Button */}
        <View
          style={{
            paddingVertical: Spacing.small,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => navigation.goBack()}
          >
            {!isPersonalProfile && (
              <Icon name="chevron-left" size={24} color={Colors.text} />
            )}
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
          style={{ flex: 1 }}
          contentContainerStyle={{}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "column",
              paddingHorizontal: 0,
            }}
          >
            {/* Avtar div */}
            <View
              style={{
                backgroundColor: Colors.cardBackground,
                height: 213,
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: Spacing.medium,
              }}
            >
              {pickedImage ? (
                <Avatars
                  size={96}
                  imageSource={getImageSource()}
                  secondaryComponent={
                    isEditingView
                      ? () => (
                          <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                          >
                            <Icon name="camera" size={18} color="#fff" />
                          </TouchableOpacity>
                        )
                      : null
                  }
                />
              ) : (
                <View
                  style={{
                    height: 96,
                    width: 96,
                    borderRadius: 50,
                  }}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={100}
                    color={Colors.text}
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
                        <Icon name="camera" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              {/* Name */}
              <CustomEditableInput
                disableEditing={isEditingView ? false : true}
                style={{
                  paddingHorizontal: Spacing.medium,
                  width: "100%",
                }}
                iconColor={Colors.text}
                textStyle={{
                  fontSize: 24,
                  lineHeight: 32,

                  color: Colors.text,

                  textAlign: "center",
                }}
                inputStyle={{
                  fontSize: 24,
                  lineHeight: 32,
                  fontFamily: Typography.fontFamilyMedium,
                  color: Colors.text,
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
                  paddingHorizontal: Spacing.medium,
                  width: "60%",
                }}
                iconColor={Colors.text}
                textStyle={{
                  fontSize: 14,
                  color: Colors.lightText,

                  textAlign: "center",
                }}
                inputStyle={{
                  fontSize: 14,
                  color: Colors.lightText,
                }}
                value={profile?.tagLine ?? "Brotherhood Elite Member"}
                onChangeText={(text) => {
                  setProfile({ ...profile, tagLine: text });
                }}
              />
            </View>
            <View style={{ height: 13 }}></View>
            {/* Progress Div */}
            <View
              style={{
                backgroundColor: Colors.cardBackground,
                height: 200,
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: Spacing.medium,
                paddingHorizontal: 17,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.primary,
                  paddingTop: 0,
                  alignSelf: "flex-start",
                }}
              >
                Progress Snapshot{" "}
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
                      color: Colors.q4,
                      fontSize: 24,
                      paddingBottom: 2,
                    }}
                  >
                    {profile?.points || 0}
                  </Text>
                  <Text
                    style={{
                      color: Colors.lightText,
                      fontSize: 14,
                    }}
                  >
                    Points
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
                      color: Colors.primary,
                      fontSize: 24,
                      paddingBottom: 2,
                    }}
                  >
                    {profile?.highestStreak || 0}
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
              </View>
              {/* row 2 */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 2,
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
                      color: Colors.primary,
                      fontSize: 24,
                      paddingBottom: 2,
                    }}
                  >
                    {profile?.challengeCount || 0}
                  </Text>
                  <Text
                    style={{
                      color: Colors.lightText,
                      fontSize: 14,
                    }}
                  >
                    Challenges
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
                      color: Colors.q2,
                      fontSize: 24,
                      paddingBottom: 2,
                    }}
                  >
                    {profile?.communityLevel || "-"}
                  </Text>
                  <Text
                    style={{
                      color: Colors.lightText,
                      fontSize: 14,
                    }}
                  >
                    Brotherhood Level
                  </Text>
                </View>
              </View>
            </View>
            {/* Age Div */}
            <View
              style={{
                height: 82,
                backgroundColor: Colors.cardBackground,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",

                paddingHorizontal: 17,
                borderRadius: 12,
                marginTop: Spacing.medium,
              }}
            >
              <CustomInput
                label={"Age"}
                suffix={"Years"}
                disableEditing={isEditingView ? false : true}
                value={profile?.age ? profile.age.toString() : "25"}
                onChangeText={(text) =>
                  setProfile({ ...profile, age: parseInt(text) })
                }
              />
            </View>
            {/* Height */}
            <View
              style={{
                height: 82,
                backgroundColor: Colors.cardBackground,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",

                paddingHorizontal: 17,
                borderRadius: 12,
                marginTop: Spacing.medium,
              }}
            >
              <CustomInput
                label={"Height"}
                suffix={"Cms"}
                disableEditing={isEditingView ? false : true}
                value={profile?.height ? profile.height.toString() : "0"}
                onChangeText={(text) =>
                  setProfile({ ...profile, height: parseInt(text) })
                }
              />
            </View>
            {/* Weight */}
            <View
              style={{
                height: 82,
                backgroundColor: Colors.cardBackground,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",

                paddingHorizontal: 17,
                borderRadius: 12,
                marginTop: Spacing.medium,
              }}
            >
              <CustomInput
                label={"Weight"}
                suffix={"Kgs"}
                disableEditing={isEditingView ? false : true}
                value={profile?.weight ? profile.weight.toString() : "0"}
                onChangeText={(text) =>
                  setProfile({ ...profile, weight: parseInt(text) })
                }
              />
            </View>
            {/* Quadarant Progrees */}
            <View
              style={{
                backgroundColor: Colors.cardBackground,
                height: 254,
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: Spacing.medium,
                paddingTop: Spacing.medium,
                paddingHorizontal: 17,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.primary,
                  paddingTop: 0,
                  alignSelf: "flex-start",
                }}
              >
                Life Quadrants{" "}
              </Text>

              {profile?.focusAreaProgress &&
                profile?.focusAreaProgress.length > 0 &&
                profile.focusAreaProgress.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      height: 40,
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: Spacing.small,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                        }}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                        }}
                      >
                        {parseInt(item.totalProgress) || 0}%
                      </Text>
                    </View>
                    {/* Progress bar */}
                    <View
                      style={{
                        width: "100%",

                        paddingHorizontal: Spacing.small,
                      }}
                    >
                      <ProgressBar
                        progress={parseInt(item.totalProgress) || 0}
                        color={getColorByFocusArea(item.name)}
                      />
                    </View>
                  </View>
                ))}
            </View>
            {/* Theme Preference */}
            <View
              style={{
                height: 120,
                backgroundColor: Colors.cardBackground,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",

                paddingHorizontal: 17,
                borderRadius: 12,
                marginTop: Spacing.medium,
              }}
            >
              <SelectInput
                label="Theme Preference"
                options={[
                  {
                    label: "Light",
                    value: "light",
                  },
                  { label: "Dark", value: "dark" },
                ]}
                placeholder="Select your theme"
                value={theme}
                onChange={handleThemeChange}
              />
            </View>

            {/* Email div */}

            <View
              style={{
                height: 82,
                backgroundColor: Colors.cardBackground,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",

                paddingHorizontal: 17,
                borderRadius: 12,
                marginTop: Spacing.medium,
              }}
            >
              <CustomInput
                label={"Email"}
                disableEditing={true}
                value={
                  profile?.email
                    ? profile.email.toString()
                    : "example@example.com"
                }
                onChangeText={(text) => setProfile({ ...profile, email: text })}
              />
            </View>

            <View
              style={{
                width: "100%",
                bottom: 0,
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
                marginBottom: Spacing.large,
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
                    backgroundColor: Colors.cardBackground,
                    padding: 24,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 16,
                      }}
                    >
                      Select Image
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Ionicons name="close" size={24} color={Colors.text} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      backgroundColor: Colors.lightBodyBackground,
                      borderRadius: 8,
                    }}
                    onPress={handlePickImage}
                  >
                    <Text style={{ fontSize: 16 }}>Choose from Gallery</Text>
                  </TouchableOpacity>
                  <View style={{ height: Spacing.medium }}></View>
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      backgroundColor: Colors.lightBodyBackground,
                      borderRadius: 8,
                    }}
                    onPress={handleOpenCamera}
                  >
                    <Text style={{ fontSize: 16 }}>Open Camera</Text>
                  </TouchableOpacity>
                  <View style={{ height: Spacing.large }}></View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
