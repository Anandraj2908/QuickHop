import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RideConfirmationModal = ({ visible, onAnimationComplete }) => {
  const translateX = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (visible) {
      // Fade in the background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Animate the motorcycle
      Animated.timing(translateX, {
        toValue: screenWidth + 100,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        // Animation complete callback
        setTimeout(() => {
          onAnimationComplete();
        }, 500);
      });
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.motorcycleContainer,
              { transform: [{ translateX }] }
            ]}
          >
            <MaterialCommunityIcons
              name="motorbike"
              size={48}
              color="#2196F3"
            />
          </Animated.View>
          <Text style={styles.confirmingText}>Confirming your ride...</Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motorcycleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmingText: {
    marginTop: 100,
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
});

export default RideConfirmationModal;