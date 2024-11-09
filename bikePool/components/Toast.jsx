import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Toast = (() => {
  let setToastState;

  const ToastComponent = () => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const opacity = useState(new Animated.Value(0))[0];

    // This method will be used to set the state for the toast
    setToastState = (msg) => {
      setMessage(msg);
      setVisible(true);
    };

    useEffect(() => {
      if (visible) {
        // Fade in
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Fade out after 3 seconds
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setVisible(false));
        }, 3000); // Duration of 3 seconds
      }
    }, [visible, opacity]);

    if (!visible) return null;

    return (
      <Animated.View style={[styles.toastContainer, { opacity }]}>
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    );
  };

  // Static method to show the toast
  ToastComponent.show = (msg) => {
    setToastState && setToastState(msg);
  };

  return ToastComponent;
})();

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 80,
    left: width * 0.1,
    right: width * 0.1,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Toast;
