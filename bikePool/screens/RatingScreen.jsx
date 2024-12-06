import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RatingScreen = () => {
  const [rating, setRating] = useState(0);
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const handleRatingChange = (value) => {
    setRating(Math.round(value));
  };

  const handleCrossPress = () => {
    router.replace('/home');
  };

  const handleSubmitPress = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.patch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/users/update-ride-rating`,
        {
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      handleCrossPress()
    } catch (error) {
      console.log("Error in updating rider status:", error);
      alert("Error in updating rider status. Please try again later or you can skip this step.");
    }
  };

  const ratingText = () => {
    switch (Math.round(rating)) {
      case 0: return 'Horrible';
      case 1: return 'Mediocre';
      case 2: return 'Good';
      case 3: return 'Great';
      case 4: return 'Excellent';
      case 5: return 'Amazing';
      default: return '';
    }
  };

  const ratingIcon = () => {
    switch (Math.round(rating)) {
      case 0: return 'frown';
      case 1: return 'meh';
      case 2: return 'smile';
      case 3: return 'laugh';
      case 4: return 'thumbs-up';
      case 5: return 'trophy';
      default: return 'thumbs-up';
    }
  };

  const ratingColor = () => {
    switch (Math.round(rating)) {
      case 0: return '#FF4C4C';
      case 1: return '#FFAD33';
      case 2: return '#FFDD44';
      case 3: return '#4CAF50';
      case 4: return '#3B82F6';
      case 5: return '#8B5CF6';
      default: return '#4CAF50';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: ratingColor() }]}>
      <TouchableOpacity style={styles.closeIcon} onPress={handleCrossPress}>
        <Ionicons name="close" size={40} color="white" />
      </TouchableOpacity>
      <Text style={styles.topBarText}>Give {name} a shoutout! How was the ride?</Text>
      <Text style={styles.ratingText}>{ratingText()}</Text>
      <FontAwesome5 name={ratingIcon()} size={80} color="white" style={{ marginVertical: 10 }} />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5}
        value={rating}
        onValueChange={handleRatingChange}
        step={1}
        thumbTintColor="#FFFFFF"
        minimumTrackTintColor="#FFFFFF"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmitPress}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  closeIcon: {
    position: 'absolute',
    top: 50,
    left: 35,
  },
  topBarText: {
    fontSize: 40,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'monospace',
  },
  ratingText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginVertical: 10,
  },
  slider: {
    width: '90%',
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default RatingScreen;
