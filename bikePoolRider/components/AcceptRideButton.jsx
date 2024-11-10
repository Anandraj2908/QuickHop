import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

const AcceptingRidesButton = ({ isAcceptingRides, toggleAcceptingRides, rippleAnimation }) => {
  const rippleScale = rippleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2]
  });

  const rippleOpacity = rippleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0]
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={toggleAcceptingRides}
        activeOpacity={0.9}
        style={styles.touchableArea}
      >
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.ripple,
              {
                transform: [{ scale: rippleScale }],
                opacity: rippleOpacity,
                backgroundColor: isAcceptingRides ? '#34D399' : '#EF4444',
              }
            ]}
          />
          <View style={[
            styles.circle,
            isAcceptingRides ? styles.circleOn : styles.circleOff
          ]}>
            <Text style={styles.mainText}>
              {isAcceptingRides ? 'ON' : 'OFF'}
            </Text>
            <Text style={styles.subText}>
              {isAcceptingRides ? 'Accepting Rides' : 'Not Accepting'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 70,
    
  },
  touchableArea: {
    width: 200,
    height: 200,
  },
  circleContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  circleOn: {
    backgroundColor: '#34D399',
  },
  circleOff: {
    backgroundColor: '#EF4444',
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#fff',
  },
};

export default AcceptingRidesButton;