import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MotorcycleCard = () => {
  const motorcyclePosition = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Animate motorcycle infinitely from left to right
    Animated.loop(
      Animated.timing(motorcyclePosition, {
        toValue: 400, // Move to the right side of the screen
        duration: 5000, // Speed of the motorcycle
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.header}>Have a Safe Ride! 🏍️</Text>

      {/* Road */}
      <View style={styles.roadContainer}>
        <View style={styles.roadMarking}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[styles.roadMark, { left: `${i * 120}px` }]}
            />
          ))}
        </View>
      </View>

      {/* Motorcycle */}
      <Animated.View style={[styles.motorcycleContainer, { transform: [{ translateX: motorcyclePosition }] }]}>
        {/* Bike Icon */}
        <Ionicons name="bicycle" size={40} color="#F44336" />
      </Animated.View>

      {/* Clouds */}
      <View style={styles.cloudsContainer}>
        {[...Array(3)].map((_, i) => (
          <View
            key={i}
            style={[styles.cloud, { left: `${i * 200}px` }]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  header: {
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A237E',
  },
  roadContainer: {
    height: 150,
    backgroundColor: '#E3F2FD',
  },
  roadMarking: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 16,
    backgroundColor: '#424242',
  },
  roadMark: {
    position: 'absolute',
    bottom: 2,
    height: 2,
    width: 30,
    backgroundColor: '#FFEB3B',
  },
  motorcycleContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
  },
  cloudsContainer: {
    position: 'absolute',
    top: 16,
  },
  cloud: {
    position: 'absolute',
    top: 16,
    width: 50,
    height: 30,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    opacity: 0.8,
    filter: 'blur(2px)',
  },
});

export default MotorcycleCard;
