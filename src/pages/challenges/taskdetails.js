import React from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Text from "../../components/text";

import { Spacing, Typography } from "../../styles";
import SafeAreaView from "../../components/safearea";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Ensure you have this icon library installed
import { useDispatch } from "react-redux";
import { changeTaskStatus } from "../../redux/thunks/challenge";
import Video from "react-native-video";
import { getDownloadURLForReference } from "../../components/avatars";
import { ScrollView } from "react-native-gesture-handler";
import { SolidButton } from "../../components/buttons";

import { setupTrackPlayer } from "../../utils/trackplayer";
import { formatTime } from "../../utils/helpers";
import TrackPlayer from "react-native-track-player";
import {
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { AsyncImage } from "../../components/avatars";
import { useTheme } from "../../hooks/useTheme";

const VideoComponent = ({ videoInfo }) => {
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { Colors } = useTheme();
  React.useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const url = await getDownloadURLForReference(videoInfo?.url);
        setVideoUrl(url);
      } catch (error) {
        console.error("Failed to fetch video URL:", error);
      }
    };
    fetchVideoUrl();
  }, [videoInfo]);
  if (!videoUrl) {
    return null;
  }

  return (
    <>
      {loading && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      <Video
        source={{ uri: videoUrl }}
        style={{ width: "100%", height: 200 }}
        resizeMode="cover"
        controls={true}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </>
  );
};

const AudioComponent = ({ audioInfo }) => {
  const [playbackState, setPlaybackState] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const { position, duration } = useProgress(1000);
  const { Colors } = useTheme();
  React.useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const url = await getDownloadURLForReference(audioInfo?.url);
        const posterUrl = await getDownloadURLForReference(
          audioInfo?.posterUrl
        );
        console.log("Poster URL:", posterUrl);
        await setupTrackPlayer();
        // await TrackPlayer.reset();

        await TrackPlayer.add({
          id: audioInfo.id,
          url: url,
          title: audioInfo.title,
          artwork: posterUrl,
          artist: audioInfo.artist || "Unknown Artist",
        });
        //  await TrackPlayer.play();

        setAudioUrl(url);
      } catch (error) {
        console.error("Failed to fetch audio URL:", error);
      }
    };
    fetchAudioUrl();
    return () => {
      console.log("Cleaning up TrackPlayer...");
      TrackPlayer.reset();
    };
  }, [audioInfo]);

  useTrackPlayerEvents([Event.PlaybackState], (event) => {
    if (event.type === Event.PlaybackState) {
      setIsPlaying(event.state === State.Playing);
      setTimeout(() => {
        setPlaybackState(event.state);
      }, 100);
    }
  });

  const play = async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };
  const onChangeSlider = async (value) => {
    await TrackPlayer.seekTo(value);
  };
  if (!audioUrl) {
    return null;
  }

  return (
    <>
      {false && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: Colors.nestedDark,
        }}
      >
        <AsyncImage
          source={audioInfo?.posterUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9,
          }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,

            width: "100%",
            // margin: Spacing.medium,
            flexDirection: "column",
            alignItems: "stretch",

            paddingHorizontal: Spacing.medium,
            zIndex: 22,
          }}
        >
          <Text
            style={{
              color: Colors.lightText,
              fontFamily: Typography.fontFamilyBold,
              fontSize: Typography.fontSizeMedium,
              marginBottom: Spacing.small,
            }}
          >
            {audioInfo.title}
          </Text>
          <Slider
            key={"slider"}
            style={{
              height: Platform.OS === "ios" ? 30 : 40,

              display: "flex",

              marginHorizontal: Platform.OS === "ios" ? 0 : -10,
            }}
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.lightText}
            thumbTintColor={Colors.primary}
            value={position}
            onValueChange={onChangeSlider}
          />
          <View
            style={{
              marginVertical: 10,
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 10,
            }}
          >
            {/* start time */}
            <Text
              style={{
                color: Colors.lightText,
                fontSize: Typography.fontSizeMedium,
                fontFamily: Typography.fontFamily,
              }}
            >
              {formatTime(position)}
            </Text>
            {/* controls with icon */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: -5,
                marginBottom: Spacing.medium,
              }}
            >
              {/* Seek back by 10 sec */}

              {isPlaying ? (
                <TouchableOpacity
                  style={{ marginHorizontal: Spacing.medium }}
                  onPress={() => TrackPlayer.pause()}
                >
                  <Icon name="pause" size={26} color={Colors.lightText} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ marginHorizontal: Spacing.medium }}
                  onPress={() => play()}
                >
                  <Icon name="play" size={26} color={Colors.lightText} />
                </TouchableOpacity>
              )}
            </View>
            {/* end time */}
            <Text
              style={{
                color: Colors.lightText,
                fontSize: Typography.fontSizeMedium,
                fontFamily: Typography.fontFamily,
              }}
            >
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const TaskDetails = () => {
  const [comments, setComments] = React.useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { Colors } = useTheme();

  const details = route.params?.task;
  const mainColor = route.params?.mainColor || Colors.primary;

  const onGoBack = () => {
    navigation.goBack();
  };
  const handleChangeTaskStatus = async (status) => {
    try {
      let challengeId = route.params?.challengeId;
      await dispatch(
        changeTaskStatus({
          challengeId,
          taskId: details.id,
          status,
          comments: comments,
        })
      ).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error("Failed to change task status:", error);
    }
  };

  // const handleNext = () => {
  //   navigation.navigate("TaskDetails", {
  //       task: task,
  //       totalTasks: challengeDetails.totalTasks,
  //       challengeId: challengeDetails.id,
  //       mainColor: getColorByFocusArea(challengeDetails?.focusArea?.name),
  //     });
  // }

  const renderMediaComponent = () => {
    switch (details.media?.type) {
      case "VIDEO":
        return <VideoComponent videoInfo={details.media?.video} />;
      case "AUDIO":
        let audioInfo = {
          ...details.media?.audio,
          posterUrl: details.media?.posterUrl,
        };
        return <AudioComponent audioInfo={audioInfo} />;
      default:
        return null;
    }
  };
  console.log(details);
  return (
    <SafeAreaView
      enableBottomPadding
      style={{ flex: 1, backgroundColor: Colors.bodyBackground }}
    >
      {/* Task title */}
      <View
        style={{
          backgroundColor: Colors.cardBackground,
          padding: Spacing.medium,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 0,
        }}
      >
        <TouchableOpacity onPress={onGoBack} style={{ padding: 5 }}>
          <Icon name="arrow-left" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text
            style={{
              color: Colors.text,
              fontSize: 18,
              fontFamily: Typography.fontFamilyMedium,
              paddingHorizontal: 0,
              paddingVertical: 0,
              textAlign: "center",
            }}
          >
            {details.title}
          </Text>
          {/* Order/total */}
          <Text
            style={{
              paddingHorizontal: 0,
              paddingVertical: 0,
              marginTop: 8,
              fontSize: 14,
              color: Colors.textSecondary,
            }}
          >{`Day ${details.order} of ${route.params?.totalTasks}`}</Text>
        </View>

        <View style={{ width: 30 }} />
        {/* Placeholder for alignment */}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0} // 80 = tab bar height, adjust as needed
      >
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              padding: 17.5,
            }}
          >
            {/* Media Component */}
            <View
              style={{
                width: "100%",
                marginBottom: 16,
                backgroundColor: Colors.nestedDark,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {renderMediaComponent()}
              <View
                style={{
                  flexDirection: "column",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Typography.fontFamilyMedium,
                  }}
                >
                  {details.media?.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Typography.fontFamily,
                    color: Colors.textSecondary,
                  }}
                >
                  {details.media?.body}
                </Text>
              </View>
            </View>
            {/* Activity */}
            {details.activity && (
              <View style={{ width: "100%", marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Typography.fontFamilyMedium,
                    marginBottom: 8,
                    color: Colors.text,
                  }}
                >
                  Activity
                </Text>
                {/* title text */}
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.textSecondary,
                  }}
                >
                  {details.activity.text}
                </Text>
                {details.activity.children &&
                  details.activity.children.length > 0 && (
                    <View style={{ marginTop: 8, marginLeft: 8 }}>
                      {details.activity.children.map((child, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            marginBottom: 6,
                          }}
                        >
                          <FontAwesome
                            name="circle"
                            size={10}
                            color={mainColor}
                            style={{ marginRight: 8, marginTop: 6 }}
                          />
                          <Text
                            key={index}
                            style={{
                              fontSize: 16,
                              color: Colors.textSecondary,
                              paddingVertical: 0,
                            }}
                          >
                            {child}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
              </View>
            )}
            {/* key takeaways */}
            {details.keyTakeaways && details.keyTakeaways.length > 0 && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Typography.fontFamilyMedium,
                    marginBottom: 8,
                    color: Colors.text,
                  }}
                >
                  Key Takeaways
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.textSecondary,
                  }}
                >
                  {details.keyTakeaways &&
                    details.keyTakeaways.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                          }}
                        >
                          <FontAwesome
                            name="circle"
                            size={10}
                            color={mainColor}
                            style={{ marginRight: 8, marginTop: 6 }}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              color: Colors.textSecondary,
                              flex: 1,
                              flexWrap: "wrap",
                              paddingVertical: 0,
                              marginBottom: 6,
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      );
                    })}
                </Text>
              </>
            )}
            {/* Your Reflection */}
            {details.userTaskStatus !== "COMPLETED" && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Typography.fontFamilyMedium,
                    marginBottom: 8,
                    color: Colors.text,
                  }}
                >
                  Your Reflection
                </Text>
                <TextInput
                  style={{
                    borderRadius: 12,
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
                  placeholder="What insights did you gain from today's content? How will you apply this?"
                  placeholderTextColor={Colors.textSecondary}
                  onChangeText={(text) => {
                    setComments(text);
                  }}
                />
              </>
            )}
            {/* Action Buttons */}
            {details.userTaskStatus !== "COMPLETED" ? (
              <>
                <View style={{ width: "100%", flexDirection: "column" }}>
                  <SolidButton
                    title="Mark  Complete"
                    onPress={() => handleChangeTaskStatus("COMPLETED")}
                    style={{
                      backgroundColor: mainColor,
                      marginTop: 24,
                      width: "100%",
                    }}
                  />
                  {/* <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {details.order > 1 && (
                <SolidButton
                  title={"Previous Day"}
                  onPress={() => {}}
                  icon={
                    <View style={{ marginRight: 15 }}>
                      <Icon
                        name="chevron-left"
                        size={16}
                        color={Colors.white}
                      />
                    </View>
                  }
                  style={{
                    height: 50,
                    backgroundColor: Colors.nestedDark,
                    marginTop: 16,
                    width: "48%",
                  }}
                  textStyle={{
                    color: Colors.white,
                    fontFamily: Typography.fontFamilyRegular,
                  }}
                />
              )}
              {details.order < route.params?.totalTasks && (
                <SolidButton
                  title={"Next Day"}
                  onPress={() => {}}
                  icon2={
                    <View style={{ marginLeft: 15 }}>
                      <Icon
                        name="chevron-right"
                        size={16}
                        color={Colors.white}
                      />
                    </View>
                  }
                  style={{
                    height: 50,
                    backgroundColor: Colors.info,
                    marginTop: 16,
                    width: "48%",
                  }}
                  textStyle={{
                    color: Colors.white,
                    fontFamily: Typography.fontFamilyRegular,
                  }}
                />
              )}
            </View> */}
                </View>
              </>
            ) : (
              <SolidButton
                title="Completed"
                onPress={() => handleChangeTaskStatus("PENDING")}
                style={{
                  backgroundColor: Colors.nestedDark,
                  marginTop: 24,
                  width: "100%",
                }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TaskDetails;
