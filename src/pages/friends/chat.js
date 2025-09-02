import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Colors, Spacing, Typography } from "../../styles"; // Adjust the import path as necessary

import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Actions,
  Bubble,
} from "react-native-gifted-chat";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { getConversation, getMessages } from "../../redux/thunks/friends";
import { useDispatch } from "react-redux";
import {
  useRoute,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useSelector } from "react-redux";
import { useSocket } from "../../hooks/useSocket";
import {
  getDownloadURLForReference,
  Avatars,
} from "../../components/avatars/index";
import LoadingOverlay from "../../components/loadingOverlay";
import SafeAreaView from "../../components/safearea";

function FriendChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const userId = useSelector((state) => state.user.userData.id);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { socket } = useSocket();

  const route = useRoute();
  const conversationId = useRef(null);

  useEffect(() => {
    const join = (id) => socket.emit("joinConversation", id);

    fetchConversation().then((id) => {
      join(id);

      socket.on("connect", () => {
        join(id);
      });

      const handleMessage = async (message) => {
        let mappedMessage = await mapMessagesToGiftedChat(message);
        setMessages((previous) => GiftedChat.append(previous, mappedMessage));
      };
      socket.on("message", handleMessage);

      return () => {
        socket.off("message", handleMessage);
        socket.off("connect");
      };
    });
  }, []);

  const mapMessagesToGiftedChat = async (message) => {
    return {
      _id: message.id,
      text: message.content,
      createdAt: new Date(message.createdAt),
      user: {
        _id: message.senderId,
        name: message?.sender?.displayName,
        avatar:
          message?.sender?.photoUrl &&
          (await getDownloadURLForReference(message.sender.photoUrl)),
      },
    };
  };

  const mapGiftedChatMessageToAPI = (message) => {
    return {
      conversationId: conversationId.current,
      content: message.text,
      createdAt: message.createdAt.toISOString(),
      senderId: userId,
    };
  };

  const fetchConversation = async () => {
    try {
      setLoading(true);
      let friendId = route.params.friend.id;
      let conversation = await dispatch(getConversation(friendId)).unwrap();
      conversationId.current = conversation.id;
      let mappedMessages = await Promise.all(
        conversation.messages.map(mapMessagesToGiftedChat)
      );
      setMessages(mappedMessages.sort((a, b) => b.createdAt - a.createdAt));

      setLoading(false);
      return conversation.id;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      setLoading(false);
    }
  };

  const onSend = useCallback((newMessages = []) => {
    let mappedMessages = mapGiftedChatMessageToAPI(newMessages[0]);
    socket.emit("sendMessage", {
      ...mappedMessages,
    });
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  const onLoadEarlier = async () => {
    if (isLoadingEarlier) return;
    setIsLoadingEarlier(true);

    try {
      const oldestMessage = messages[messages.length - 1]; // last item (oldest)
      const olderMessages = await dispatch(
        getMessages({
          conversationId: conversationId.current,
          cursor: oldestMessage?._id,
        })
      ).unwrap();

      if (olderMessages.length > 0) {
        const mappedMessages = await Promise.all(
          olderMessages.map(mapMessagesToGiftedChat)
        );

        // PREPEND older messages at the top
        setMessages((previousMessages) =>
          GiftedChat.prepend(previousMessages, mappedMessages)
        );
      }
    } catch (error) {
      console.error("Failed to load earlier messages:", error);
    } finally {
      setIsLoadingEarlier(false);
    }
  };

  const friend = route.params.friend;

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <LoadingOverlay visible={loading} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0} // 80 = tab bar height, adjust as needed
        >
          <View
            style={{
              padding: Spacing.medium,
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightGray,
              marginBottom: Spacing.medium,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-left" size={24} color={Colors.black} />

              <View
                style={{ marginLeft: Spacing.medium, flexDirection: "row" }}
              >
                {friend?.photoUrl ? (
                  <Avatars size={40} imageSource={{ uri: friend.photoUrl }} />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={40}
                    color={Colors.gray}
                  />
                )}
                <Text
                  style={{
                    fontSize: Typography.fontSizeMedium,
                    fontWeight: Typography.fontFamilyMedium,
                    marginLeft: Spacing.medium,
                  }}
                >
                  {friend?.displayName}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <GiftedChat
            // messagesContainerStyle={{
            //   flex: 1,
            //   marginTop: Spacing.medium,
            //   backgroundColor: "blue",
            // }}
            renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
            onSend={onSend}
            messages={messages}
            user={{ _id: userId }}
            bottomOffset={0}
            alwaysShowSend={true}
            isKeyboardInternallyHandled={false}
            renderBubble={(props) => (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: Colors.primary,
                  },
                  left: {
                    backgroundColor: Colors.lightGray,
                  },
                }}
              />
            )}
            onLoadEarlier={onLoadEarlier}
            isLoadingEarlier={isLoadingEarlier}
            loadEarlier={true}
            // renderLoadEarlier={}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const CustomInputToolbar = (props) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      height: 60,
    }}
  >
    {/* Example: Add an attachment button */}
    {/* <Actions
      {...props}
      containerStyle={{
        alignSelf: "center",
        marginBottom: 0,
      }}
    /> */}
    {/* Composer (text input) */}
    <Composer
      {...props}
      multiline={true}
      composerHeight={40}
      textInputStyle={{
        color: Colors.text,
        backgroundColor: Colors.grayBg,
        borderRadius: 20,
        paddingHorizontal: 16,
        marginHorizontal: 8,
        paddingVertical: 8,

        flex: 1,
        textAlignVertical: "center",
      }}
      placeholder="Type your message..."
    />
    {/* Send button */}
    <Send
      {...props}
      containerStyle={{
        marginBottom: 0,
        alignSelf: "center",

        justifyContent: "center",
      }}
    >
      <Ionicons
        name="send-outline"
        size={28}
        color={Colors.primary}
        style={{ marginRight: 8 }}
      />
    </Send>
  </View>
);

export default FriendChat;
