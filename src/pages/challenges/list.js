import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import Text from "../../components/text"; // Adjust the import path as necessary
import { RefreshControl } from "react-native";
import { Spacing, Typography } from "../../styles"; // Adjust the import path as necessary
import { Pills } from "../../components/pills";
import { useDispatch, useSelector } from "react-redux";

import { fetchChallenges } from "../../redux/thunks/challenge"; // Adjust the import path as necessary
import { AsyncImage } from "../../components/avatars";
import { OutlinedButton, SolidButton } from "../../components/buttons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../../components/loadingOverlay";
import SafeAreaView from "../../components/safearea";
import { joinChallenge } from "../../redux/thunks/challenge"; // Adjust the import path as necessary
import Toast from "react-native-toast-message";
import { toTitleCase, getColorByFocusArea } from "../../utils/helpers";
import ProgressBar from "../../components/progressbar";
import { useTheme } from "../../hooks/useTheme";

const ChallengeCard = ({ challenge, onPress, onJoin }) => {
  const { Colors } = useTheme();
  const color = getColorByFocusArea(challenge?.focusArea?.name);
  const challengeStatus = challenge?.challengeStatus;
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: "100%",
          backgroundColor: Colors.cardBackground,
          borderRadius: 16,
          padding: 21,
          marginBottom: Spacing.medium,
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: Typography.fontWeightBold,
            paddingHorizontal: 0,
          }}
        >
          {challenge.title}
        </Text>
        {/* Tags */}
        <View style={{ flexDirection: "row", marginTop: Spacing.small }}>
          <View
            style={{
              marginRight: Spacing.small,
              backgroundColor: color,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: Colors.white }}>
              {" "}
              {challenge?.focusArea?.label
                ? challenge.focusArea.label
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
            <Text style={{ color: Colors.text }}>
              {" "}
              {challenge?.difficultyLevel
                ? toTitleCase(challenge.difficultyLevel)
                : "Beginner"}
            </Text>
          </View>
        </View>
        {}
        {/* progress section */}
        {(challengeStatus === "ENROLLED" ||
          challengeStatus === "COMPLETED") && (
          <View
            style={{
              width: "100%",
              marginTop: Spacing.medium,
              flexDirection: "column",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ paddingHorizontal: 0, color: Colors.lightText }}>
                Progress
              </Text>
              <Text style={{ color, fontWeight: Typography.fontWeightMedium }}>
                {challenge.challengeProgress
                  ? `${challenge.challengeProgress}%`
                  : "0%"}
              </Text>
            </View>
            <ProgressBar
              progress={challenge.challengeProgress || 0}
              color={color}
            />
          </View>
        )}

        {challengeStatus !== "ENROLLED" && challengeStatus !== "COMPLETED" && (
          <>
            {/* Subtitle */}
            <Text
              style={{
                fontSize: 16,

                marginTop: Spacing.medium,
                lineHeight: 23,
                color: Colors.lightText,
              }}
            >
              {challenge.subtitle}
            </Text>

            {/* Action button and duration */}
            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 15,
                justifyContent: "space-between",

                padding: 0,
              }}
            >
              <Text style={{ fontSize: 16 }}>
                {" "}
                {challenge.durationDays || 0} days
              </Text>
              <SolidButton
                title="Join"
                onPress={() => onJoin(challenge)}
                style={{
                  paddingHorizontal: Spacing.large,
                  borderRadius: Spacing.small,
                  width: 150,
                  height: 40,
                }}
              />
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ChallengesList = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterTag, setFilterTag] = useState("All");
  const { Colors } = useTheme();
  const challengesFromReducer = useSelector(
    (state) => state.challenge.challenges
  );
  const [challenges, setChallenges] = useState(challengesFromReducer);

  const isMounted = useRef(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (isMounted.current) {
        fetchData();
      } else {
        fetchDataWithLoading();
      }
    }, [])
  );
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const fetchDataWithLoading = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };
  const fetchData = async () => {
    try {
      const response = await dispatch(
        fetchChallenges({ tag: filterTag })
      ).unwrap();
      console.log("Fetched challenges:", response);
      setChallenges(response);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const onChallengePress = (challenge) => {
    navigation.navigate("ChallengeDetails", { challenge });
  };
  const onJoinChallenge = async (challenge) => {
    try {
      setLoading(true);
      await dispatch(joinChallenge(challenge.id)).unwrap();
      await fetchData();
      console.log("Successfully joined challenge:", challenge);
    } catch (error) {
      console.error("Error joining challenge:", error);
      Toast.show({
        type: "error",
        text1: "Error joining challenge",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    console.log("Refreshing user details...");
    setRefreshing(true);
    await fetchData();
    // Simulate a network request

    setRefreshing(false);
  };

  const getButton = (challenge) => {
    if (challenge.challengeStatus === "ENROLLED") {
      return (
        <OutlinedButton
          title="Joined"
          onPress={() => onChallengePress(challenge)}
          style={{
            marginTop: Spacing.medium,
            marginBottom: Spacing.medium,
            paddingHorizontal: Spacing.large,
            borderRadius: Spacing.small,
            borderWidth: 2,
            borderColor: Colors.primary,
            width: "90%",
            marginHorizontal: "auto",
          }}
          textStyle={{
            color: Colors.primary,
            fontFamily: Typography.fontFamily,
          }}
        />
      );
    }

    if (challenge.challengeStatus === "COMPLETED") {
      return (
        <OutlinedButton
          title="Completed"
          onPress={() => onChallengePress(challenge)}
          style={{
            marginTop: Spacing.medium,
            marginBottom: Spacing.medium,
            paddingHorizontal: Spacing.large,
            borderRadius: Spacing.small,
            borderWidth: 2,
            borderColor: Colors.primary,
            width: "90%",
            marginHorizontal: "auto",
          }}
          textStyle={{
            color: Colors.primary,
            fontFamily: Typography.fontFamily,
          }}
        />
      );
    }
    return (
      <OutlinedButton
        title="Join Challenge"
        onPress={() => onJoinChallenge(challenge)}
        style={{
          marginTop: Spacing.medium,
          marginBottom: Spacing.medium,
          paddingHorizontal: Spacing.large,
          borderRadius: Spacing.small,
          borderWidth: 2,
          borderColor: Colors.primary,
          width: "90%",
          marginHorizontal: "auto",
        }}
        textStyle={{
          color: Colors.primary,
          fontFamily: Typography.fontFamily,
        }}
      />
    );
  };
  const ActiveChallenges = challenges.filter(
    (challenge) =>
      challenge.challengeStatus === "ENROLLED" ||
      challenge.challengeStatus === "COMPLETED"
  );
  const AvailableChallenges = challenges.filter(
    (challenge) =>
      challenge.challengeStatus !== "ENROLLED" &&
      challenge.challengeStatus !== "COMPLETED"
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackground }}>
      <LoadingOverlay visible={loading && challenges.length === 0} />
      <View style={{ flex: 1, width: "100%", paddingHorizontal: 17.5 }}>
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
              onPress={() => {}}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 0,
                  paddingLeft: 0,
                  color: Colors.text,
                }}
              >
                {"Monthly Challenges"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Active Challenges */}
          {ActiveChallenges.length > 0 && (
            <>
              <Text
                style={{
                  fontSize: 18,
                  paddingHorizontal: 0,
                  marginBottom: Spacing.medium,
                }}
              >
                Active Challenges
              </Text>
              {ActiveChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onPress={() => onChallengePress(challenge)}
                  button={getButton(challenge)}
                />
              ))}
            </>
          )}
          {/* Available Challenges */}
          <>
            <Text
              style={{
                fontSize: 18,
                paddingHorizontal: 0,
                marginBottom: Spacing.medium,
              }}
            >
              Available Challenges
            </Text>
            {AvailableChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onPress={() => onChallengePress(challenge)}
                onJoin={() => onJoinChallenge(challenge)}
              />
            ))}
          </>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChallengesList;
