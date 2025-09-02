import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { Spacing, Colors, Typography } from "../../styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../../redux/thunks/content"; // Adjust the import path as necessary
import { ContentCard } from "./cards";
import LoadingOverlay from "../../components/loadingOverlay";
import SafeAreaView from "../../components/safearea";

const ContentList = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const contentReducer = useSelector((state) => state.content);
  const [data, setData] = useState(contentReducer.contentList);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await dispatch(fetchContent()).unwrap();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await dispatch(fetchContent()).unwrap();
    setData(result);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <LoadingOverlay visible={loading && data.length === 0} />
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
          Explore Content
        </Text>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        data={data}
        renderItem={({ item }) => <ContentCard key={item.id} data={item} />}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default ContentList;
