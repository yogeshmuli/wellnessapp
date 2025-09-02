import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal, Text } from "react-native";

const LoadingOverlay = ({ visible = false, message = "Processing..." }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ActivityIndicator
          size="large"
          // style={{transform: [{scaleX: 2}, {scaleY: 2}]}}
          color="#1976d2"
        />
        <Text style={{ color: "white", fontSize: 20 }}>{message}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    zIndex: 999,
  },
});

export default LoadingOverlay;
