import React, { useState, useEffect } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { Colors } from "../../styles";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "@react-native-firebase/storage";
import FastImage from "react-native-fast-image";

export const getDownloadURLForReference = async (reference) => {
  const storage = getStorage();
  const storageRef = ref(storage, reference);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const AsyncImage = React.memo(
  (props) => {
    const [posterUrl, setPosterUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      function fetchPoster(reference) {
        getDownloadURLForReference(reference)
          .then((url) => {
            setPosterUrl(url);
          })
          .catch((err) => {
            console.log("error in fetching poster", err, props.source);
          });
      }

      if (typeof props.source === "number") {
        // If source is a number, it's likely a local image asset
        setLoading(false);
        setPosterUrl(props.source);
        return;
      }
      if (
        typeof props.source === "string" &&
        (props.source.includes("http") || props.source.includes("https"))
      ) {
        setPosterUrl(props.source);
      } else if (typeof props.source === "string") {
        fetchPoster(props.source);
      } else if (props.source && props.source.uri) {
        if (
          props.source.uri.includes("http") ||
          props.source.uri.includes("https")
        ) {
          setPosterUrl(props.source.uri);
        } else {
          // If it's a local file path, we can set it directly
          if (props.source.uri?.includes("file://")) {
            setPosterUrl(props.source.uri);
          } else {
            fetchPoster(props.source.uri);
          }
        }
      }
    }, [props.source]);

    return (
      <View
        style={[
          props.style,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        {posterUrl ? (
          <>
            <FastImage
              style={props?.style ? props.style : {}}
              source={
                typeof posterUrl === "number"
                  ? posterUrl
                  : {
                      uri: posterUrl,
                      priority: FastImage.priority.normal,
                    }
              }
              resizeMode={props.resizeMode || FastImage.resizeMode.cover}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />

            {loading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={"large"} />
              </View>
            )}
          </>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    // For string URLs
    if (
      typeof prevProps.source === "string" &&
      typeof nextProps.source === "string"
    ) {
      return prevProps.source === nextProps.source;
    }
    // For object sources (e.g. { uri: ... })
    if (
      typeof prevProps.source === "object" &&
      typeof nextProps.source === "object" &&
      prevProps.source !== null &&
      nextProps.source !== null
    ) {
      return prevProps.source.uri === nextProps.source.uri;
    }
    return false;
  }
);

export const Avatars = ({
  imageSource,
  size = 50,
  borderWidth = 0,
  borderColor = Colors.primary,
  secondaryComponent = null,
  nestedImageSize = 0,
}) => {
  return (
    <View
      style={{
        height: size + borderWidth,
        width: size + borderWidth,
        borderRadius: size / 2 + borderWidth / 2,

        borderColor: borderColor,
        borderWidth: borderWidth,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.lightGray,
      }}
    >
      {/* dont resize image */}
      <AsyncImage
        source={imageSource}
        // resizeMode="center"
        style={{
          height: nestedImageSize || size,
          width: nestedImageSize || size,
          borderRadius: size / 2,
        }}
      />
      {secondaryComponent && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: Colors.primary,
            borderRadius: size / 4,
            padding: 8,
          }}
        >
          {secondaryComponent()}
        </View>
      )}
    </View>
  );
};
