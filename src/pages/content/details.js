import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { fetchContentById } from "../../redux/thunks/content";
import Video from "react-native-video";
import LoadingOverlay from "../../components/loadingOverlay";
import { Spacing, Colors, Typography } from "../../styles";
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import SafeAreaView from "../../components/safearea";

import {
  AsyncImage,
  getDownloadURLForReference,
} from "../../components/avatars";
import { setupTrackPlayer } from "../../utils/trackplayer";
import WebView from "react-native-webview";

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const TrackPlayerComponent = ({ trackDetails }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const { position, duration } = useProgress(1000);
  const [playbackState, setPlaybackState] = useState(null);
  useEffect(() => {
    const setupTrackPlayerFunc = async () => {
      try {
        console.log("Setting up TrackPlayer with details:", trackDetails);
        await setupTrackPlayer();

        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: trackDetails.id,
          url: trackDetails.audio.url,
          title: trackDetails.title,
          artist: trackDetails.artist || "Unknown Artist",
          artwork:
            trackDetails.posterUrl ?? "https://picsum.photos/id/1/200/300",
        });
        console.log("TrackPlayer setup complete 123");
      } catch (error) {
        console.error("Error setting up TrackPlayer:", error);
      }

      // add listner to track audio track state
    };
    setupTrackPlayerFunc();

    return () => {
      // TrackPlayer.reset();
    };
  }, [trackDetails]);

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
      let list = await TrackPlayer.getQueue();

      await TrackPlayer.play();
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };
  const onChangeSlider = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  return (
    <View
      style={{
        width: "100%",
        height: "auto",

        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: Colors.white,
          // height: 350,
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            height: 300,
          }}
        >
          <AsyncImage
            source={trackDetails.posterUrl}
            style={{ height: 250, width: "100%", marginVertical: 10 }}
            resizeMode="cover"
          />
          {playbackState === State.Buffering ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : null}
        </View>
        {/* slider */}

        <View
          style={{
            width: "90%",
            // margin: Spacing.medium,
            flexDirection: "column",
            alignItems: "stretch",
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
            {trackDetails.title}
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

      <View style={{ padding: Spacing.medium, flex: 1 }}>
        <ScrollView
          style={{}}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              color: Colors.lightText,
              fontFamily: Typography.fontFamilyRegular,
              fontSize: Typography.fontSizeMedium,
            }}
          >
            {trackDetails?.body}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const VideoComponent = ({ videoDetails }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  return (
    <>
      <View
        style={{
          width: "100%",
          height: "auto",
          marginTop: Spacing.medium,

          flex: 1,
        }}
      >
        {isLoading && (
          <View
            style={{
              height: 300,
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
        {/* {isLoading && <LoadingOverlay visible={isLoading} />} */}
        <Video
          source={{ uri: videoDetails.video.url }}
          style={{ width: "100%", height: 300 }}
          resizeMode="contain"
          controls={true}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            console.error("Video playback error");
          }}
        />
        {/* description */}
        <View style={{ padding: Spacing.medium, flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: Colors.lightText,
                fontFamily: Typography.fontFamilyRegular,
                fontSize: Typography.fontSizeMedium,
              }}
            >
              {videoDetails?.body}
            </Text>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const ArticleComponent = ({ articleDetails }) => {
  const [loading, setLoading] = React.useState(true);
  return (
    <>
      {/* {loading && (
        <LoadingOverlay visible={loading} message="Loading article..." />
      )} */}
      <View style={{ flex: 1 }}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: articleDetails?.article.body }}
          style={{ flex: 1 }}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    </>
  );
};

const ContentDetails = () => {
  const [details, setDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let id = route.params?.content?.id;
        if (id) {
          let contentDetails = await dispatch(fetchContentById(id)).unwrap();
          if (contentDetails.type === "AUDIO") {
            let audioUrl = await getDownloadURLForReference(
              contentDetails.audio.url
            );
            contentDetails.audio.url = audioUrl;
          }
          setDetails(contentDetails);
        }
      } catch (error) {
        console.error("Error fetching content details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, route.params?.content?.id]);

  const renderMediaPlayer = () => {
    try {
      switch (details?.type) {
        case "VIDEO": {
          return <VideoComponent videoDetails={details} />;
        }
        case "AUDIO": {
          return <TrackPlayerComponent trackDetails={details} />;
        }
        case "ARTICLE": {
          return <ArticleComponent articleDetails={details} />;
        }

        case "IMAGE":
          return (
            <AsyncImage
              source={{ uri: details?.mediaUrl }}
              style={{ width: "100%", height: 300 }}
            />
          );

        default:
          break;
      }
    } catch (error) {
      console.error("Error rendering media player:", error);
    }

    return null;
  };

  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      console.error("Playback Error:", event);
      Alert.alert(
        "Playback Error",
        event.message || "An error occurred during playback."
      );
    }
  });

  const onGoBack = async () => {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      navigation.goBack();
    } catch (error) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LoadingOverlay visible={loading} message="Loading content..." />
      {/* Header  */}
      <View
        style={{
          paddingHorizontal: Spacing.medium,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => onGoBack()}
        >
          <Icon name="chevron-left" size={24} color={Colors.black} />

          <Text
            style={{
              fontSize: Typography.fontSizeLarge,
              fontWeight: "bold",
              marginLeft: Spacing.small,
            }}
          >
            {details?.title}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Media Player section */}

      {details && renderMediaPlayer()}
    </SafeAreaView>
  );
};

export default ContentDetails;
