import React, { use, useEffect } from "react";
import { TouchableOpacity, View, ScrollView } from "react-native";
import Text from "../../components/text";
import SafeAreaView from "../../components/safearea";
import { Spacing, Typography } from "../../styles";
import { fetchHabits, enrollInHabit } from "../../redux/thunks/habits";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "@react-native-firebase/auth";

import Icon from "react-native-vector-icons/FontAwesome5";
import {
  toTitleCase,
  getColorByFocusArea,
  getIconByFocusArea,
} from "../../utils/helpers";
import LoadingOverlay from "../../components/loadingOverlay";
import ProgressBar from "../../components/progressbar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useTheme } from "../../hooks/useTheme";

const HabitsList = () => {
  const habitFromReducer = useSelector((state) => state.habits.habits);
  const [habits, setHabits] = React.useState(habitFromReducer || []);
  const [loading, setLoading] = React.useState(false);
  const userId = getAuth().currentUser.uid;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { Colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      fetchUserHabits();
    }, [])
  );

  const fetchUserHabits = async () => {
    try {
      setLoading(true);
      const data = await dispatch(fetchHabits()).unwrap();

      setHabits(data);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const enrollHabit = async (habitId) => {
    try {
      setLoading(true);
      let res = await dispatch(enrollInHabit({ habitId })).unwrap();
      await fetchUserHabits();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to enroll in habit. Please try again.",
      });
      console.error("Error in enrolling user", error);
    } finally {
      setLoading(false);
    }
  };

  const getHabitProgress = (habit) => {
    let startDate = new Date(habit.activeFrom);
    let endDate = new Date(habit.activeTo);
    let currentDate = new Date();
    // get diffencce between two dates in days
    let totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    let elapsedDays = Math.ceil(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );
    let progress = (elapsedDays / totalDays) * 100;
    return progress > 100 ? 100 : progress; // Ensure progress does not exceed 100%
  };

  const onClickHabit = (habit) => {
    try {
      // Navigate to the habit details page
      navigation.navigate("HabitDetails", { habit: habit });
    } catch (error) {
      console.error("Error navigating to habit details:", error);
    }
  };

  const activeHabits = habits.filter(
    (habit) => habit.habitStatus === "ENROLLED"
  );
  const availableHabits = habits.filter(
    (habit) => habit.habitStatus === "NOT_ENROLLED"
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.bodyBackground,
      }}
    >
      <LoadingOverlay visible={loading && habits.length === 0} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,

            padding: 17.5,
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSizeLarge,
              fontWeight: "bold",
              color: Colors.text,
              paddingHorizontal: 0,
            }}
          >
            Monthly Habits
          </Text>
          {activeHabits && activeHabits.length > 0 && (
            <>
              {/* Active Habits */}
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Typography.fontFamilyRegular,
                  paddingHorizontal: 0,
                }}
              >
                Active Habits
              </Text>
              <View>
                {activeHabits.map((habit, key) => {
                  const mainColor = getColorByFocusArea(habit.focusArea?.name);
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => onClickHabit(habit)}
                    >
                      <View
                        style={{
                          backgroundColor: Colors.cardBackground,
                          flexDirection: "column",
                          justifyContent: "center",

                          borderRadius: 8,
                          padding: Spacing.medium,

                          width: "100%",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Icon
                            name={getIconByFocusArea(habit.focusArea?.name)}
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
                          <Text>+ 10 pts</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                          }}
                        >
                          <Text
                            style={{
                              paddingHorizontal: 0,
                              fontFamily: Typography.fontFamilyMedium,
                              marginBottom: 10,
                            }}
                          >
                            {habit?.title}
                          </Text>
                          <ProgressBar
                            color={mainColor}
                            progress={getHabitProgress(habit)}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
          {availableHabits && availableHabits.length > 0 && (
            <>
              {/* Active Habits */}
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Typography.fontFamilyRegular,
                  paddingHorizontal: 0,
                  color: Colors.text,
                }}
              >
                Available Habits
              </Text>
              <View
                style={{
                  marginTop: Spacing.medium,
                }}
              >
                {availableHabits.map((habit, key) => {
                  let mainColor = getColorByFocusArea(habit.focusArea?.name);
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => onClickHabit(habit)}
                    >
                      <View
                        style={{
                          borderRadius: 12,
                          backgroundColor: Colors.cardBackground,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingHorizontal: Spacing.medium,
                          paddingVertical: Spacing.medium,
                          width: "100%",
                        }}
                      >
                        <Icon
                          name={getIconByFocusArea(habit.focusArea?.name)}
                          size={16}
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

                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            flex: 1,
                            justifyContent: "flex-start",
                            paddingHorizontal: Spacing.medium,
                          }}
                        >
                          <Text
                            style={{
                              paddingHorizontal: 0,
                              paddingVertical: 0,
                              fontSize: 16,
                              fontFamily: Typography.fontFamilyMedium,
                            }}
                          >
                            {habit?.title}
                          </Text>
                          {/* tags */}
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: Spacing.small,
                            }}
                          >
                            <View
                              style={{
                                marginRight: Spacing.small,
                                backgroundColor: Colors.lightBodyBackground,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: Colors.white,
                                }}
                              >
                                {" "}
                                {habit?.focusArea?.label
                                  ? habit.focusArea.label
                                  : "Other"}
                              </Text>
                            </View>
                            <View
                              style={{
                                marginRight: Spacing.small,
                                backgroundColor: Colors.lightBodyBackground,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                {" "}
                                {habit?.difficultyLevel
                                  ? toTitleCase(habit.difficultyLevel)
                                  : "Beginner"}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => enrollHabit(habit.id)}>
                          <View
                            style={{
                              height: 40,
                              width: 40,
                              backgroundColor: mainColor,
                              borderRadius: 99,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Icon name="plus" size={16} color={Colors.text} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HabitsList;
