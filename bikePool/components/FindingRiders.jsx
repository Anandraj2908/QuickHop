import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RadarScanner = () => {
  const [rotateAnimation] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    rotate.start();
    pulse.start();

    return () => {
      rotate.stop();
      pulse.stop();
    };
  }, []);

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.radarContainer}>
            {/* Background circles */}
            {[...Array(3)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.circle,
                  {
                    width: 200 - index * 50,
                    height: 200 - index * 50,
                    borderWidth: 1,
                  },
                ]}
              />
            ))}

            {/* Scanner line */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ rotate: rotation }],
                },
              ]}
            />

            {/* Dots */}
            <View style={[styles.dot, { top: '30%', left: '60%' }]} />
            <View style={[styles.dot, { top: '50%', left: '40%' }]} />

            {/* Grid lines */}
            <View style={styles.verticalLine} />
            <View style={styles.horizontalLine} />

            {/* Tick marks */}
            {[...Array(16)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.tickMark,
                  {
                    transform: [
                      { rotate: `${index * (360 / 16)}deg` },
                      { translateY: -100 },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* Separate text container */}
        <View style={styles.textWrapper}>
          <View style={styles.textContainer}>
            <Text style={styles.text} allowFontScaling={false}>
              Finding nearby riders...
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#001a1a',
    marginTop:210,
    marginBottom:50
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001a1a',
    position: 'relative',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001a1a',
  },
  radarContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 240,
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    borderColor: '#00ffff',
    backgroundColor: 'transparent',
  },
  scanLine: {
    position: 'absolute',
    width: 100,
    height: 2,
    backgroundColor: '#00ffff',
    opacity: 0.7,
    right: 100,
    transformOrigin: 'right',
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#00ffff',
    opacity: 0.3,
  },
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#00ffff',
    opacity: 0.3,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00ffff',
  },
  tickMark: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: '#00ffff',
    opacity: 0.5,
  },
  textWrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: '100%',
    zIndex: 999,
  },
  textContainer: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
  },
  text: {
    fontSize: 18,
    color: '#fff',  
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    letterSpacing: 0.5,
  },
});

export default RadarScanner;