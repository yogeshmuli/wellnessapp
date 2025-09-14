import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
} from "react-native";
import Text from "../../components/text";
import { AsyncImage, Avatars } from "../../components/avatars/index";
import { Spacing, Typography } from "../../styles";
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
import FontAwesome from "react-native-vector-icons/FontAwesome5"; // Ensure you have this icon library installed
import FontAwesomeOld from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Ionicons";
import { SolidButton } from "../../components/buttons";
import { joinChallenge } from "../../redux/thunks/challenge"; // Adjust the import path as necessary

import SafeAreaView from "../../components/safearea";
import { getColorByFocusArea } from "../../utils/helpers";
import ProgressBar from "../../components/progressbar";
import { useTheme } from "../../hooks/useTheme";

const TaskCard = ({ task, mainColor, onClick }) => {
  const { Colors } = useTheme();
  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={{
          backgroundColor: Colors.cardBackground,
          borderLeftWidth: 4,
          borderLeftColor: mainColor,
          flexDirection: "column",
          width: "100%",

          borderRadius: 8,
          padding: Spacing.medium,
          marginBottom: Spacing.medium,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: Typography.fontFamilyMedium,
              paddingHorizontal: 0,
            }}
          >
            {task.title}
          </Text>
          {task.userTaskStatus === "COMPLETED" && (
            <View
              style={{
                backgroundColor: mainColor,
                padding: 4,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: Colors.white, padding: 0 }}>Completed</Text>
            </View>
          )}
        </View>
        <Text style={{ color: Colors.lightText, paddingHorizontal: 0 }}>
          {task.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ChallengesDetails = () => {
  const [loading, setLoading] = React.useState(true);
  const [challengeDetails, setChallengeDetails] = React.useState(null);

  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { Colors } = useTheme();
  const { challenge } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      fetchChallenge();
    }, [])
  );

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

  const handleTaskClick = (task) => {
    navigation.navigate("TaskDetails", {
      task: task,
      totalTasks: challengeDetails.totalTasks,
      challengeId: challengeDetails.id,
      mainColor: getColorByFocusArea(challengeDetails?.focusArea?.name),
    });
  };

  const getButton = () => {
    if (challengeDetails?.challengeStatus === "NOT_ENROLLED") {
      return (
        <View style={{ width: "100%" }}>
          <SolidButton
            title="Join Challenge"
            onPress={onJoinChallenge}
            style={{
              backgroundColor: mainColor,
              marginTop: Spacing.large,
              marginBottom: Spacing.large,

              width: "100%",
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

  const mainColor = getColorByFocusArea(challengeDetails?.focusArea?.name);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackground }}>
        <LoadingOverlay visible={loading && !challengeDetails} />
        {challengeDetails && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 17.5,
            }}
          >
            {/* header */}
            <View
              style={{
                paddingVertical: Spacing.small,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <FontAwesome
                  name="chevron-left"
                  size={24}
                  color={Colors.text}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginLeft: 10,
                    paddingLeft: 0,
                    color: Colors.text,
                  }}
                >
                  Challenge Details
                </Text>
              </TouchableOpacity>
            </View>
            {/* Challenge title */}
            <View
              style={{
                paddingVertical: Spacing.small,
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: Colors.text,
                  paddingHorizontal: 0,
                }}
              >
                {challengeDetails?.title}
              </Text>
              {/* Duration and average tasktime */}
              <View style={{ flexDirection: "row", marginTop: Spacing.small }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: 20,
                  }}
                >
                  {/* icon */}
                  <FontAwesomeOld
                    name="calendar"
                    size={14}
                    color={Colors.lightText}
                    solid
                  />
                  <Text
                    style={{
                      color: Colors.lightText,
                      marginLeft: 10,
                      lineHeight: 18,
                      padding: 0,
                    }}
                  >
                    {challengeDetails?.durationDays} days
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    height: 20,
                    marginLeft: Spacing.large,
                  }}
                >
                  {/* icon */}
                  <FontAwesome
                    name="clock"
                    size={14}
                    color={Colors.lightText}
                    solid
                  />
                  <Text
                    style={{
                      color: Colors.lightText,
                      marginLeft: 10,
                      lineHeight: 18,
                      padding: 0,
                    }}
                  >
                    {challengeDetails?.averageDuration} min/day
                  </Text>
                </View>
              </View>
              {/* Subtitle */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: Typography.fontWeightRegular,
                  color: mainColor,
                  marginTop: Spacing.small,
                  paddingHorizontal: 0,
                }}
              >
                {challengeDetails?.subtitle}
              </Text>
              {/* About this challenge */}
              <View
                style={{
                  marginTop: Spacing.large,
                  backgroundColor: Colors.cardBackground,
                  width: "100%",
                  borderRadius: 16,
                  padding: Spacing.medium,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: 0,
                    fontFamily: Typography.fontFamilyMedium,
                    fontSize: 18,
                    marginBottom: 0,
                    paddingBottom: 0,
                  }}
                >
                  About This Challenge
                </Text>
                <Text
                  style={{
                    paddingHorizontal: 0,

                    fontFamily: Typography.fontFamilyRegular,
                    fontSize: 16,
                    color: Colors.textSecondary,
                    lineHeight: 26,
                  }}
                >
                  {challengeDetails?.about}
                </Text>
                <Text
                  style={{
                    paddingHorizontal: 0,
                    fontFamily: Typography.fontFamilyMedium,
                    fontSize: 18,

                    marginTop: Spacing.small,
                  }}
                >
                  Benefits
                </Text>
                <View
                  style={{
                    flexDirection: "column",
                    marginTop: Spacing.small,
                  }}
                >
                  {challengeDetails?.benefits?.map((benefit, index) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          backgroundColor: mainColor,
                          height: 24,
                          width: 24,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 12,
                          marginRight: Spacing.small,
                        }}
                      >
                        <Icon name="star" size={16} color={Colors.white} />
                      </View>
                      <Text
                        style={{
                          paddingHorizontal: 0,
                          fontFamily: Typography.fontFamilyRegular,
                          fontSize: 16,
                          color: Colors.textSecondary,
                          lineHeight: 24,
                        }}
                      >
                        {benefit}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              {/* Progress */}
              {challengeDetails?.challengeStatus !== "NOT_ENROLLED" && (
                <View
                  style={{
                    marginTop: 40,
                    height: 140,
                    width: "100%",
                    backgroundColor: Colors.cardBackground,
                    borderRadius: 16,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    paddingHorizontal: Spacing.medium,
                    paddingVertical: 20,
                  }}
                >
                  {/* row 1 */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        paddingHorizontal: 0,
                        fontFamily: Typography.fontFamilyMedium,
                        fontSize: 16,
                      }}
                    >
                      Your Progress
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: 0,
                        fontFamily: Typography.fontFamilyRegular,
                        fontSize: 16,
                        color: Colors.textSecondary,
                      }}
                    >
                      {`${challengeDetails.completedTasks}/${challengeDetails.totalTasks}`}
                    </Text>
                  </View>
                  {/* row 2 */}
                  <ProgressBar
                    height={12}
                    progress={challengeDetails?.challengeProgress || 0}
                    color={mainColor}
                  />
                  {/* row 3 */}
                  <Text
                    style={{
                      paddingHorizontal: 0,
                      marginTop: 10,
                      color: Colors.lightText,
                    }}
                  >
                    {challengeDetails?.challengeProgress || 0}% Complete
                  </Text>
                </View>
              )}

              {/* Tasks */}
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Typography.fontFamilyMedium,
                  marginBottom: Spacing.medium,
                  marginTop: Spacing.large,
                  paddingHorizontal: 0,
                }}
              >
                Course Content
              </Text>
              {challengeDetails?.tasks.map((task, index) => (
                <TaskCard
                  key={index}
                  task={task}
                  mainColor={mainColor}
                  onClick={() => handleTaskClick(task)}
                />
              ))}

              {getButton()}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default ChallengesDetails;
