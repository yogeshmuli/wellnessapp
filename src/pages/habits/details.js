import React from "react";
import { View, TouchableOpacity, ScrollView, TextInput } from "react-native";
import Text from "../../components/text";
import SafeAreaView from "../../components/safearea";
import { Spacing, Typography } from "../../styles";
import {
  submitHabitRecord,
  fetchHabitDetails,
  enrollInHabit,
} from "../../redux/thunks/habits";
import { useDispatch } from "react-redux";
import { getAuth } from "@react-native-firebase/auth";

import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { toTitleCase, getColorByFocusArea } from "../../utils/helpers";
import LoadingOverlay from "../../components/loadingOverlay";
import ProgressBar from "../../components/progressbar";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SolidButton } from "../../components/buttons";
import { BottomSheetModal } from "../../components/modals/index";
import { useTheme } from "../../hooks/useTheme";

const HabitDetails = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [comments, setComments] = React.useState("");
  const route = useRoute();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = getAuth().currentUser.uid;

  const { habit: habitFromRoute } = route.params;
  const [habit, setHabit] = React.useState(habitFromRoute);
  const { Colors } = useTheme();
  const mainColor = getColorByFocusArea(habit?.focusArea?.name);

  const onEnrollInHabit = async () => {
    try {
      setLoading(true);
      await dispatch(enrollInHabit({ habitId: habit.id, userId })).unwrap();
      // refetch habit details
      const updatedHabit = await dispatch(fetchHabitDetails(habit.id)).unwrap();
      setHabit(updatedHabit);
    } catch (error) {
      console.log("Error enrolling in habit:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHabitRecord = async () => {
    try {
      setLoading(true);
      await dispatch(
        submitHabitRecord({ habitId: habit.id, comments })
      ).unwrap();

      setModalVisible(false);
      // refetch habit details
      const updatedHabit = await dispatch(fetchHabitDetails(habit.id)).unwrap();
      setHabit(updatedHabit);
      // reset comments
      setComments("");
    } catch (error) {
      console.log("Error submitting habit record:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHabitDurationDetails = () => {
    let startDate = new Date(habit.activeFrom);
    let endDate = new Date(habit.activeTo);
    let currentDate = new Date();
    // get diffencce between two dates in days
    let totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    let elapsedDays = Math.ceil(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );
    let progress = (elapsedDays / totalDays) * 100;
    return { totalDays, elapsedDays, progress };
  };
  const getCurrentStreak = () => {
    let tracker = [...habit.habitTracker]; // array of dates when habit was completed
    if (!tracker || tracker.length === 0) return 0;

    // Sort the tracker dates in descending order
    tracker.sort((a, b) => new Date(b.date) - new Date(a.date));

    return tracker[0].streak;
  };

  const getDayInHabbitFromDate = (date) => {
    let startDate = new Date(habit.activeFrom);
    let currentDate = new Date(date);
    let dayInHabbit = Math.ceil(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );
    return dayInHabbit;
  };

  const isRecordSubmittedForToday = () => {
    let tracker = habit.habitTracker;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return tracker.some((entry) => {
      let entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackground }}>
      <LoadingOverlay visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 17.5,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {/* header */}
          <View
            style={{
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
              <FontAwesome name="chevron-left" size={24} color={Colors.text} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 10,
                  paddingLeft: 0,
                  color: Colors.text,
                }}
              >
                Habit Details
              </Text>
            </TouchableOpacity>
          </View>
          {/* detail card */}
          <View
            style={{
              padding: Spacing.large,
              backgroundColor: Colors.cardBackground,
              borderRadius: 16,
              marginTop: Spacing.large,
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* Name and current day */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  padding: 0,
                  fontSize: 24,
                  fontFamily: Typography.fontFamilyBold,
                  color: Colors.text,
                  lineHeight: 36,
                  width: "60%",
                }}
              >
                {habit?.title}
              </Text>
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: Typography.fontFamilyBold,
                    color: mainColor,
                    textAlign: "right",
                    padding: 0,
                  }}
                >
                  {getHabitDurationDetails().elapsedDays}
                </Text>
                <Text
                  style={{
                    color: Colors.lightText,
                  }}
                >
                  / {getHabitDurationDetails().totalDays} days
                </Text>
              </View>
            </View>
            {/* tags */}
            <View style={{ flexDirection: "row", marginTop: Spacing.small }}>
              <View
                style={{
                  marginRight: Spacing.small,
                  backgroundColor: mainColor,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: Colors.white }}>
                  {" "}
                  {habit?.focusArea?.label ? habit.focusArea.label : "Other"}
                </Text>
              </View>
              <View
                style={{
                  marginRight: Spacing.small,
                  backgroundColor: Colors.lightBodyBackground,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: Colors.text }}>
                  {" "}
                  {habit?.difficultyLevel
                    ? toTitleCase(habit.difficultyLevel)
                    : "Beginner"}
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View
              style={{
                marginTop: Spacing.small,

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Typography.fontFamilyRegular,
                  color: Colors.lightText,
                  paddingHorizontal: 0,
                }}
              >
                Progress
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Typography.fontFamilyMedium,
                  color: Colors.lightText,
                  color: mainColor,
                  paddingHorizontal: 0,
                }}
              >
                {parseInt(getHabitDurationDetails().progress)}%
              </Text>
            </View>
            <View style={{ width: "100%", marginTop: Spacing.small }}>
              <ProgressBar progress={30} color={mainColor} />
            </View>
            {/* current streak */}
            <View
              style={{
                flexDirection: "row",
                marginTop: Spacing.medium,
                alignItems: "center",
              }}
            >
              <FontAwesome name="fire" size={20} color={Colors.warning} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Typography.fontFamilyRegular,
                  color: Colors.lightText,
                }}
              >
                Current Streak: {getCurrentStreak()} days
              </Text>
            </View>
          </View>
          {/* what to do card */}
          <View
            style={{
              padding: Spacing.large,
              backgroundColor: Colors.cardBackground,
              borderRadius: 16,
              marginTop: Spacing.large,
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* What to do */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: Spacing.medium,
              }}
            >
              <FontAwesome name="lightbulb" size={18} color={Colors.primary} />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Typography.fontFamilyBold,
                  color: Colors.text,

                  paddingVertical: 0,
                }}
              >
                What to do
              </Text>
            </View>
            {habit?.activity?.text && (
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Typography.fontFamilyRegular,
                  color: Colors.lightText,
                  lineHeight: 24,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                }}
              >
                {habit?.activity?.text}
              </Text>
            )}
            {habit?.activity?.children && (
              <View
                style={{
                  marginTop: Spacing.medium,

                  width: "100%",
                }}
              >
                {habit.activity.children.map((child, index) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      width: "100%",
                      marginBottom: Spacing.small,
                    }}
                    key={index}
                  >
                    <FontAwesome
                      name="circle"
                      solid
                      size={10}
                      color={mainColor}
                      style={{ marginRight: 10, marginTop: 6 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Typography.fontFamilyRegular,
                        color: Colors.lightText,
                        width: "100%",
                        paddingVertical: 0,
                        paddingHorizontal: 0,
                        marginVertical: 0,
                        flexShrink: 1,
                      }}
                    >
                      {child}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {habit?.tips?.children && (
              <View
                style={{
                  marginTop: Spacing.medium,
                  width: "100%",
                  backgroundColor: Colors.nestedDark,
                  padding: Spacing.medium,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: mainColor,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome
                    name="info-circle"
                    size={18}
                    color={mainColor}
                    style={{ marginBottom: Spacing.small }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Typography.fontFamilyBold,
                      color: mainColor,
                      marginBottom: Spacing.small,
                      paddingHorizontal: 0,
                      marginLeft: 10,
                    }}
                  >
                    Tips & Instructions
                  </Text>
                </View>
                {habit.tips.children.map((tip, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      marginBottom: Spacing.small,
                    }}
                  >
                    <FontAwesome
                      name="circle"
                      solid
                      size={6}
                      color={mainColor}
                      style={{ marginRight: 8, marginTop: 6 }}
                    />
                    <Text
                      style={{
                        paddingHorizontal: 0,
                        paddingVertical: 0,
                        flexShrink: 1,
                      }}
                    >
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Tracker */}
          <View
            style={{
              padding: Spacing.large,
              backgroundColor: Colors.cardBackground,
              borderRadius: 16,
              marginTop: Spacing.large,
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: Typography.fontFamilyBold,
                color: Colors.text,
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}
            >
              Tracker
            </Text>
            {habit?.habitTracker?.length > 0 &&
              habit?.habitTracker?.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: Spacing.small,
                    borderLeftWidth: 4,
                    borderLeftColor: mainColor,
                    borderRadius: 12,
                    padding: 10,

                    backgroundColor: Colors.nestedDark,
                    minHeight: 80,
                    width: "100%",
                    marginTop: Spacing.medium,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  {/* Day */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginVertical: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Typography.fontFamilyBold,
                        color: Colors.text,
                        paddingVertical: 0,
                      }}
                    >
                      Day {getDayInHabbitFromDate(item.date)}
                    </Text>
                    <Text
                      style={{ color: Colors.lightText, paddingVertical: 0 }}
                    >
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: "numeric", // e.g., "2025"
                        month: "short", // e.g., "August"
                        day: "numeric", // e.g., "22"
                      })}
                    </Text>
                  </View>
                  {/* comments */}
                  {item.comments && (
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Typography.fontFamilyRegular,
                        color: Colors.lightText,
                        paddingVertical: 0,
                        marginVertical: Spacing.small,
                      }}
                    >
                      {item.comments}
                    </Text>
                  )}
                  {/* completed */}
                </View>
              ))}
          </View>
          {habit.habitStatus === "ENROLLED" ? (
            !isRecordSubmittedForToday() && (
              <SolidButton
                title="Log Today's Record"
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  marginTop: Spacing.large,
                  marginBottom: Spacing.large,
                  width: "100%",
                  backgroundColor: mainColor,
                }}
              />
            )
          ) : (
            <SolidButton
              title="Enroll to Habit"
              onPress={() => {
                onEnrollInHabit();
              }}
              style={{
                marginTop: Spacing.large,
                marginBottom: Spacing.large,
                width: "100%",
                backgroundColor: mainColor,
              }}
            />
          )}
        </View>
        {/* BottomSheet */}
        <BottomSheetModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <LoadingOverlay visible={loading} />
          <View
            style={{
              backgroundColor: Colors.bodyBackground,
              padding: 20,
              borderTopWidth: 4,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderTopColor: Colors.lightBodyBackground,
              height: 400,
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              // use box shadow for better visibility
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {/* title */}
            <View
              style={{
                width: "100%",
                marginBottom: Spacing.large,
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: Typography.fontFamilyBold,
                  color: Colors.text,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                }}
              >
                Today's Record
              </Text>
              {/* close icon */}
              <TouchableOpacity
                style={{ position: "absolute", right: 0, top: 0 }}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome name="times" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            {/* comments */}
            <Text
              style={{
                fontSize: 16,
                fontFamily: Typography.fontFamilyMedium,
                color: Colors.lightText,
                paddingVertical: 0,
                paddingHorizontal: 0,
                marginBottom: Spacing.medium,
              }}
            >
              Notes (optional)
            </Text>
            <TextInput
              style={{
                borderRadius: 12,
                borderColor: Colors.lightBorder,
                borderWidth: 1,
                fontSize: 16,
                fontFamily: Typography.fontFamily,
                padding: 10,
                color: Colors.lightText,
                width: "100%",
                height: 130,
                backgroundColor: Colors.nestedDark,
                textAlign: "center", // horizontal centering
                textAlignVertical:
                  Platform.OS === "android" ? "center" : undefined,
                paddingTop: Platform.OS === "ios" ? 45 : 0, // adjust to half of height minus font size
              }}
              multiline
              placeholder="How did it feel? Any insights?"
              placeholderTextColor={Colors.textSecondary}
              onChangeText={(text) => {
                setComments(text);
              }}
            />
            {/* submit button */}
            <SolidButton
              title="Submit"
              onPress={() => onSubmitHabitRecord()}
              style={{
                marginTop: Spacing.large,
                width: "100%",
                backgroundColor: mainColor,
              }}
            />
          </View>
        </BottomSheetModal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HabitDetails;
