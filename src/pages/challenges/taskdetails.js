import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { Colors, Spacing, Typography } from "../../styles";
import SafeAreaView from "../../components/safearea";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Ensure you have this icon library installed
import { useDispatch } from "react-redux";
import { changeTaskStatus } from "../../redux/thunks/challenge";
import Video from "react-native-video";
import { getDownloadURLForReference } from "../../components/avatars";

const VideoComponent = ({ videoInfo }) => {
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
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

const TaskDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const details = route.params?.task;
  console.log("Task Details:", details);

  const onGoBack = () => {
    navigation.goBack();
  };
  const handleChangeTaskStatus = async (status) => {
    try {
      let challengeId = route.params?.challengeId;
      await dispatch(
        changeTaskStatus({ challengeId, taskId: details.id, status })
      ).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error("Failed to change task status:", error);
    }
  };

  const renderMediaComponent = () => {
    switch (details.media?.type) {
      case "VIDEO":
        return <VideoComponent videoInfo={details.media?.video} />;
      case "AUDIO":
        return;
      default:
        return null;
    }
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.white,
      }}
    >
      <View
        style={{
          padding: Spacing.medium,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
        <Text
          style={{
            fontFamily: Typography.fontFamilyBold,
            fontSize: Typography.fontSizeLarge,
            color: Colors.success,
            fontWeight: Typography.fontFamilyBoldItalic,
          }}
        >
          + {details?.xp} XP
        </Text>
      </View>

      {details?.media && (
        <View
          style={{
            height: 200,
            width: "auto",
            backgroundColor: Colors.lightGray,
            margin: Spacing.medium,
          }}
        >
          {renderMediaComponent()}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <RenderHtml
          classesStyles={{}}
          tagsStyles={{
            section: {
              padding: 16,
              fontSize: Typography.fontSizeMedium,
              lineHeight: 28,
            },
          }}
          contentWidth={300}
          source={{
            html: details?.description || "<p>No description available</p>",
          }}
        />
      </View>
      {!details.userTaskStatus ? null : details.userTaskStatus ===
        "COMPLETED" ? (
        <TouchableOpacity
          onPress={() => {
            handleChangeTaskStatus("PENDING");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#FEF3C7",
              height: 75,
              width: "auto",
              alignItems: "center",
              paddingHorizontal: Spacing.medium,
              borderRadius: Spacing.small,
              marginHorizontal: Spacing.medium,
              marginBottom: Spacing.medium,
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
      ) : (
        <TouchableOpacity
          onPress={() => {
            handleChangeTaskStatus("COMPLETED");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "rgb(239 253 244)",
              height: 75,
              width: "auto",
              alignItems: "center",
              paddingHorizontal: Spacing.medium,
              borderRadius: Spacing.small,
              marginHorizontal: Spacing.medium,
              marginBottom: Spacing.medium,
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
                Mark as complete
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
    </View>
  );
};

export default TaskDetails;
