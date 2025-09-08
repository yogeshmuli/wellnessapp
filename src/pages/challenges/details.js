import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
} from "react-native";
import { AsyncImage, Avatars } from "../../components/avatars/index";
import { Spacing, Colors, Typography } from "../../styles";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  fetchChallengeDetails,
  changeTaskStatus,
  addComment,
  deleteComment,
} from "../../redux/thunks/challenge"; // Adjust the import path as necessary
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../../components/loadingOverlay";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Ensure you have this icon library installed
import Icon from "react-native-vector-icons/Ionicons";
import { SolidButton } from "../../components/buttons";
import { joinChallenge } from "../../redux/thunks/challenge"; // Adjust the import path as necessary
import { BottomSheetModal } from "../../components/modals";
import Entypo from "react-native-vector-icons/Entypo"; // Ensure you have this icon library installed
import Ionicons from "react-native-vector-icons/Ionicons"; // Ensure you have this icon library installed
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SafeAreaView from "../../components/safearea";

const OverviewTab = ({ challenge }) => {
  return (
    <View>
      <Text
        style={{
          fontFamily: Typography.fontFamilyRegular,
          fontSize: Typography.fontSizeMedium,
        }}
      >
        {challenge.description}
      </Text>
    </View>
  );
};

const DailyTasksTab = ({ challengeDetails, refreshData }) => {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [activeTask, setActiveTask] = React.useState(0);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  useEffect(() => {}, []);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleTaskPress = (index) => {
    // check if user is enrolled in the challenge
    // if (challengeDetails.challengeStatus === "NOT_ENROLLED") {
    //   console.warn("You must join the challenge to update task status.");
    //   return;
    // }
    // setActiveTask(index);
    // toggleModal();
    navigation.navigate("TaskDetails", {
      task: challengeDetails.tasks[index],
      challengeId: challengeDetails.id,
    });
  };

  const handleChangeTaskStatus = async (status) => {
    try {
      toggleModal();
      const response = await dispatch(
        changeTaskStatus({
          challengeId: challengeDetails.id,
          taskId: challengeDetails.tasks[activeTask]?.id,
          status,
        })
      ).unwrap();

      refreshData();

      // Close the modal after changing status
    } catch (error) {
      console.error("Error changing task status:", error);
    }
  };

  if (!challengeDetails) return null;

  return (
    <View>
      <ScrollView>
        {challengeDetails?.tasks?.map((task, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              padding: Spacing.medium,
              alignItems: "center",
              backgroundColor: Colors.lightGray,
              marginBottom: Spacing.small,
              borderRadius: Spacing.small,
            }}
          >
            <TouchableOpacity
              onPress={() => handleTaskPress(index)}
              style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
            >
              {/* checkbox */}

              {task.userTaskStatus === "PENDING" ? (
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: Colors.grayBg,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: Spacing.medium,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Typography.fontFamily,
                      fontSize: Typography.fontSizeMedium,
                      color: Colors.black,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: Colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: Spacing.medium,
                  }}
                >
                  <FontAwesome name="check" size={20} color={Colors.white} />
                </View>
              )}

              {/* title and description */}
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontFamily: Typography.fontFamily,
                    fontSize: Typography.fontSizeMedium,
                    color: Colors.black,
                    marginBottom: Spacing.small,
                  }}
                >
                  {task.title}
                </Text>
                {/* <Text
                  style={{
                    fontFamily: Typography.fontFamilyRegular,
                    fontSize: Typography.fontSizeSmall,
                    color: Colors.lightText,
                  }}
                >
                  {task.description}
                </Text> */}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <BottomSheetModal visible={isModalVisible} onClose={toggleModal}>
        <View
          style={{
            padding: Spacing.medium,
            height: 280,
            backgroundColor: Colors.white,
            justifyContent: "flex-start",
            borderTopRightRadius: Spacing.medium,
            borderTopLeftRadius: Spacing.medium,
          }}
        >
          <View
            style={{
              marginBottom: Spacing.small,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: Typography.fontFamilyMedium,
                fontSize: Typography.fontSizeMedium,
                color: Colors.text,
                marginBottom: Spacing.small,
              }}
            >
              Update Task Status
            </Text>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontFamily: Typography.fontFamilyRegular,
              fontSize: 14,
              color: Colors.lightText,
              marginBottom: Spacing.small,
            }}
          >
            {`Update status for: ${challengeDetails.tasks[activeTask]?.title} `}
          </Text>
          {/* Change Status Button */}
          {challengeDetails.tasks[activeTask]?.userTaskStatus === "PENDING" ? (
            <TouchableOpacity
              onPress={() => handleChangeTaskStatus("COMPLETED")}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "rgb(239 253 244)",
                  height: 75,
                  width: "100%",
                  alignItems: "center",
                  paddingHorizontal: Spacing.medium,
                  borderRadius: Spacing.small,
                }}
              >
                {/* check icon */}
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: "#22c55e",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: Spacing.medium,
                  }}
                >
                  <FontAwesome name="check" size={20} color={Colors.white} />
                </View>
                {/* text view */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Typography.fontFamily,
                      fontSize: Typography.fontSizeMedium,
                      color: "#22c55e",
                    }}
                  >
                    Mark as Completed
                  </Text>
                  <Text
                    style={{
                      fontFamily: Typography.fontFamilyRegular,
                      fontSize: Typography.fontSizeSmall,
                      color: Colors.lightText,
                    }}
                  >
                    This will mark the task as completed.
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleChangeTaskStatus("PENDING")}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#FEF3C7",
                  height: 75,
                  width: "100%",
                  alignItems: "center",
                  paddingHorizontal: Spacing.medium,
                  borderRadius: Spacing.small,
                }}
              >
                {/* check icon */}
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: "#f59e42",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: Spacing.medium,
                  }}
                >
                  <FontAwesome name="check" size={20} color={Colors.white} />
                </View>
                {/* text view */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Typography.fontFamily,
                      fontSize: Typography.fontSizeMedium,
                      color: "#f59e42",
                    }}
                  >
                    Mark as Incomplete
                  </Text>
                  <Text
                    style={{
                      fontFamily: Typography.fontFamilyRegular,
                      fontSize: Typography.fontSizeSmall,
                      color: Colors.lightText,
                    }}
                  >
                    This will mark the task as incomplete.
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          {/* Cancel button */}
          <SolidButton
            title="Cancel"
            onPress={toggleModal}
            textStyle={{
              color: Colors.black,
            }}
            style={{
              marginTop: Spacing.medium,
              marginBottom: Spacing.small,
              backgroundColor: Colors.lightGray,
            }}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
};

const CommentsTab = ({ challengeDetails, refreshData }) => {
  const [commentContent, setCommentContent] = React.useState("");
  const userReducer = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const onAddComment = async () => {
    try {
      let comment = commentContent.trim();
      let res = await dispatch(
        addComment({ challengeId: challengeDetails.id, comment })
      ).unwrap();
      setCommentContent(""); // Clear the comment input field
      inputRef.current?.blur(); // This will close the keyboard
      await refreshData();
      // Refresh challenge details after adding comment
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const onDeleteComment = async (commentId) => {
    try {
      await dispatch(
        deleteComment({ challengeId: challengeDetails.id, commentId })
      ).unwrap();
      await refreshData(); // Refresh challenge details after deleting comment
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Spacing.large,

          flexGrow: 1,
        }}
        style={{ width: "100%" }}
        keyboardShouldPersistTaps="handled"
      >
        {challengeDetails.comments.map((comment, index) => {
          return (
            <View
              key={index}
              style={{
                borderRadius: Spacing.small,
                marginBottom: Spacing.small,
                width: "100%",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Avatars
                imageSource={comment.user?.photoUrl}
                size={40}
                style={{ marginBottom: Spacing.small }}
              />
              <View
                style={{
                  flexDirection: "column",
                  marginLeft: Spacing.medium,
                }}
              >
                <Text
                  style={{
                    fontFamily: Typography.fontFamilyMedium,
                    fontSize: Typography.fontSizeMedium,
                    color: Colors.text,
                    marginBottom: Spacing.small,
                  }}
                >
                  {comment.user?.displayName}
                </Text>
                <Text
                  style={{
                    fontFamily: Typography.fontFamilyRegular,
                    fontSize: Typography.fontSizeSmall,
                    color: Colors.lightText,
                  }}
                >
                  {comment?.content}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "baseline",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      marginTop: Spacing.small,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Entypo
                      name="heart-outlined"
                      size={18}
                      color={Colors.lightText}
                    />
                    <Text style={{ marginLeft: Spacing.small }}>
                      {comment.likesCount || 0}
                    </Text>
                  </TouchableOpacity>
                  {/* conditionally delete icon */}
                  {comment.user?.id === userReducer.userData?.id && (
                    <TouchableOpacity
                      style={{
                        marginLeft: Spacing.small,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => onDeleteComment(comment.id)}
                    >
                      <Entypo name="trash" size={16} color={Colors.lightText} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* comment field */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          width: "100%",

          marginTop: Spacing.medium,

          borderRadius: Spacing.small,
        }}
      >
        <Avatars
          imageSource={userReducer.userData?.photoUrl}
          size={40}
          style={{ marginRight: Spacing.medium }}
        />
        <TextInput
          ref={inputRef}
          placeholder="Add a comment..."
          multiline={true}
          numberOfLines={3}
          value={commentContent}
          onChangeText={setCommentContent}
          style={{
            flex: 1,
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 20,
            padding: 12,
            marginLeft: Spacing.small,

            fontFamily: Typography.fontFamilyRegular,
            fontSize: Typography.fontSizeSmall,
            color: Colors.text,
            backgroundColor: Colors.lightGray,
            textAlignVertical: "top", // ensures text starts at the top-left
          }}
        />
        {/* send Icon */}
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: Spacing.small,
            alignSelf: "center",
          }}
          onPress={onAddComment}
        >
          <Ionicons name="send-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const tabs = [
  {
    title: "Overview",
    component: (challenge, fetchChallenge) => (
      <OverviewTab challenge={challenge} />
    ),
  },

  {
    title: "Daily Tasks",
    component: (challengeDetails, fetchChallenge) => (
      <DailyTasksTab
        challengeDetails={challengeDetails}
        refreshData={fetchChallenge}
      />
    ),
  },

  {
    title: "Comments",
    component: (challengeDetails, fetchChallenge) => (
      <CommentsTab
        challengeDetails={challengeDetails}
        refreshData={fetchChallenge}
      />
    ),
  },
];

const ChallengesDetails = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [challengeDetails, setChallengeDetails] = React.useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height
  );
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { challenge } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      fetchChallenge();
    }, [])
  );

  useEffect(() => {
    const onKeyboardShow = () => setKeyboardVisible(true);
    const onKeyboardHide = () => setKeyboardVisible(false);

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardHide
    );

    const onChange = ({ window }) => setWindowHeight(window.height);
    const dimensionListener = Dimensions.addEventListener("change", onChange);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      dimensionListener.remove();
    };
  }, []);

  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params?.activeTab]);

  async function fetchChallenge() {
    try {
      setLoading(true);
      const response = await dispatch(
        fetchChallengeDetails(challenge.id)
      ).unwrap();

      setChallengeDetails(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching challenge details:", error);
    }
  }

  const onJoinChallenge = async () => {
    try {
      setLoading(true);
      const response = await dispatch(joinChallenge(challenge.id)).unwrap();
      console.log("Joined challenge successfully:", response);
      await fetchChallenge(); // Refresh challenge details after joining
    } catch (error) {
      setLoading(false);
      console.error("Error joining challenge:", error);
    }
  };

  const getButton = () => {
    if (challengeDetails?.challengeStatus === "NOT_ENROLLED") {
      return (
        <View style={{ width: "100%" }}>
          <SolidButton
            title="Join Challenge"
            onPress={onJoinChallenge}
            style={{
              marginTop: Spacing.large,
              marginBottom: Spacing.large,
              marginHorizontal: Spacing.medium,
            }}
          />
        </View>
      );
    }
  };

  const getEnrollmentStatus = () => {
    if (challengeDetails?.challengeStatus === "NOT_ENROLLED") {
      return null;
    }
    if (challengeDetails?.challengeStatus === "ENROLLED") {
      return (
        <View
          style={{
            backgroundColor: Colors.warning,
            borderRadius: Spacing.small,
            padding: Spacing.small,
            marginHorizontal: Spacing.medium,
            color: Colors.white,
          }}
        >
          <Text style={{ color: Colors.white }}>Enrolled</Text>
        </View>
      );
    }
    if (challengeDetails?.challengeStatus === "COMPLETED") {
      return (
        <View
          style={{
            backgroundColor: Colors.success,
            borderRadius: Spacing.small,
            padding: Spacing.small,
            marginHorizontal: Spacing.medium,
          }}
        >
          <Text style={{ color: Colors.white }}>Completed</Text>
        </View>
      );
    }
  };

  if (!challengeDetails) {
    return <LoadingOverlay visible={true} message="Fetching Details" />;
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: "100%" }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              flex: 1,
            }}
          >
            {/* Conditionally render the image */}
            {
              <View
                style={{
                  width: "100%",
                  height: !(isKeyboardVisible || windowHeight < 400) ? 200 : 0,
                  backgroundColor: Colors.lightGray,
                  borderRadius: Spacing.small,
                  marginBottom: Spacing.large,
                  flexShrink: 1,
                }}
              >
                {challenge.imageUrl ? (
                  <AsyncImage
                    source={challenge.imageUrl}
                    alt={challenge.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                    resizeMode="cover"
                  />
                ) : null}
                {/* Icons to goback and share */}
                {!(isKeyboardVisible || windowHeight < 400) && (
                  <View
                    style={{
                      position: "absolute",
                      top: Spacing.medium,
                      left: Spacing.medium,
                      right: Spacing.medium,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Back Icon */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(128,128,128,0.2)",
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => navigation.goBack()}
                    >
                      <Icon
                        style={{ position: "absolute" }}
                        name="chevron-back"
                        size={24}
                        color={"white"}
                      />
                    </TouchableOpacity>
                    {/* Share Icon */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(128,128,128,0.2)",
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => console.log("Share Challenge")}
                    >
                      <Icon
                        name="share-social"
                        size={24}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            }
            {/* Challenge Title */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",

                marginBottom: Spacing.small,
              }}
            >
              <Text
                style={{
                  fontSize: Typography.fontSizeMedium,

                  color: Colors.text,
                  fontFamily: Typography.fontFamilyMedium,
                  marginBottom: Spacing.small,

                  paddingHorizontal: Spacing.medium,
                }}
              >
                {challenge.title}
              </Text>
              {getEnrollmentStatus()}
            </View>
            {/* Join 1,234 participants on this journey */}
            <Text
              style={{
                fontSize: 14,
                color: Colors.lightText,
                fontFamily: Typography.fontFamilyRegular,
                marginBottom: Spacing.large,
                alignSelf: "flex-start",
                paddingHorizontal: Spacing.medium,
              }}
            >
              Join {challenge.participantCount} participants on this journey
            </Text>

            {/* Tabs section */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
                paddingHorizontal: Spacing.medium,
              }}
            >
              {tabs.map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveTab(index)}
                  style={{
                    paddingVertical: Spacing.small,
                    paddingRight: Spacing.large,

                    borderBottomWidth: 2,
                    borderBottomColor:
                      activeTab === index ? Colors.primary : Colors.lightGray,
                  }}
                >
                  <Text
                    style={{
                      color:
                        activeTab === index ? Colors.primary : Colors.lightText,
                      fontFamily: Typography.fontFamilyRegular,
                    }}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              ))}
              {/* tab content section */}
            </View>

            <View
              style={{
                width: "100%",
                paddingHorizontal: Spacing.medium,
                paddingTop: Spacing.small,
                flex: 1,
              }}
            >
              {/* Render the active tab's component */}
              {tabs[activeTab].component(challengeDetails, fetchChallenge)}
            </View>

            {/* Solid button to join challenge */}

            {getButton()}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default ChallengesDetails;
