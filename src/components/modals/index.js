import React, { useRef, useEffect, useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "../../styles";

export const BottomSheetModal = (props) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [showModal, setShowModal] = useState(props.visible);

  useEffect(() => {
    if (props.visible) {
      setShowModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowModal(false)); // Hide after animation
    }
  }, [props.visible, slideAnim]);

  if (!showModal) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={showModal}
      onRequestClose={props.onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={props.onClose} style={{ flex: 1 }} />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ justifyContent: "flex-end", flex: 1 }}
        >
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              // backgroundColor: Colors.body,
              // padding: 20,
              // borderTopLeftRadius: 16,
              // borderTopRightRadius: 16,
              // height: 300,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {props.children}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
