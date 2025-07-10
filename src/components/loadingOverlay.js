import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';
import {Text} from 'react-native-gesture-handler';

const LoadingOverlay = ({visible = false}) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    statusBarTranslucent>
    <View style={styles.overlay}>
      <ActivityIndicator
        size="large"
        style={{transform: [{scaleX: 2}, {scaleY: 2}]}}
        color="#1976d2"
      />
      <Text style={{color: 'white', fontSize: 20}}>Processing...</Text>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
});

export default LoadingOverlay;
