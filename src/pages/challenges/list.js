import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { RefreshControl } from "react-native";
import { Colors, Spacing, Typography } from "../../styles"; // Adjust the import path as necessary
import { Pills } from "../../components/pills";
import { useDispatch, useSelector } from "react-redux";

import { fetchChallenges } from "../../redux/thunks/challenge"; // Adjust the import path as necessary
import { AsyncImage } from "../../components/avatars";
import { OutlinedButton } from "../../components/buttons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../../components/loadingOverlay";
import SafeAreaView from "../../components/safearea";
import { joinChallenge } from "../../redux/thunks/challenge"; // Adjust the import path as necessary
import Toast from "react-native-toast-message";

const ChallengesList = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterTag, setFilterTag] = useState("All");
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <LoadingOverlay visible={loading && challenges.length === 0} />
      <View
        style={{
          display: "flex",
          marginTop: Spacing.medium,
          marginBottom: Spacing.large,
          paddingHorizontal: Spacing.large,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignSelf: "flex-start",
        }}
      >
        <Text
          style={{ fontSize: Typography.fontSizeLarge, fontWeight: "bold" }}
        >
          Wellness Challenges
        </Text>
      </View>
      {/*  tag pills */}
      <View style={{ height: 60 }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: Spacing.large,
            paddingVertical: Spacing.small,
          }}
          style={{}}
        >
          {[
            "All",
            "Fitness",
            "Nutrition",
            "Mental Health",
            "Sleep",
            "Hydration",
            "Mindfulness",
            "Stress Management",
          ].map((tag) => (
            <TouchableOpacity
              key={tag}
              style={{
                marginRight: Spacing.small,
              }}
              onPress={() => setFilterTag(tag)}
            >
              <Pills
                key={tag}
                title={tag}
                backgroundColor={
                  filterTag === tag ? Colors.primary : Colors.lightGray
                }
                textColor={filterTag === tag ? Colors.white : Colors.text}
                paddingHorizontal={Spacing.medium}
                paddingVertical={Spacing.small}
                borderRadius={18}
                height={36}
                fontSize={14}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FlatList for challenges */}
      {challenges.length > 0 ? (
        <FlatList
          contentContainerStyle={{
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            paddingHorizontal: Spacing.large,
            paddingTop: Spacing.large,
          }}
          data={challenges}
          removeClippedSubviews={true}
          renderItem={({ item: challenge }) => {
            return (
              <View
                key={challenge.id}
                style={{
                  width: "100%",
                  backgroundColor: Colors.white,
                  borderRadius: Spacing.small,
                  // padding: Spacing.medium,
                  marginBottom: Spacing.medium,
                  shadowColor: Colors.black,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                }}
              >
                <TouchableOpacity
                  key={challenge.id}
                  onPress={() => onChallengePress(challenge)}
                >
                  {/* Async Image */}
                  {challenge.imageUrl ? (
                    <AsyncImage
                      source={challenge.imageUrl}
                      style={{
                        width: "100%",
                        height: 160,
                        borderRadius: Spacing.small,
                        marginBottom: Spacing.medium,
                      }}
                      resizeMode="cover"
                    />
                  ) : null}

                  <Text
                    style={{
                      fontSize: Typography.fontSizeMedium,
                      fontFamily: Typography.fontFamily,

                      marginBottom: Spacing.small,
                      paddingHorizontal: Spacing.medium,
                    }}
                  >
                    {challenge.title}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: Spacing.medium,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: Spacing.small,
                    }}
                  >
                    {/* duration and participant */}
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.textSecondary,
                        marginRight: Spacing.small,
                        fontFamily: Typography.fontFamily,
                      }}
                    >
                      {challenge.durationDays
                        ? `${challenge.durationDays} days`
                        : "No duration specified"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.textSecondary,
                        fontFamily: Typography.fontFamily,
                      }}
                    >
                      {challenge.participantCount} participants
                    </Text>
                  </View>
                  {/* Join Button OutlinedButton */}
                  {getButton(challenge)}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      ) : (
        <Text
          style={{
            color: Colors.text,
            width: "100%",

            marginTop: 20,
            textAlign: "center",
            fontFamily: Typography.fontFamily,
            fontSize: Typography.fontSizeMedium,
          }}
        >
          No challenges available
        </Text>
      )}
    </SafeAreaView>
  );
};

export default ChallengesList;
