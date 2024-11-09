import { Link, } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { useGetUserData} from "../hooks/useGetUserData.js";
import { Toast } from "react-native-toast-notifications";
import * as Notifications from "expo-notifications";

export default function HomeScreen() {
  


  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to the App!</Text>
      <Text style={styles.subText}>Edit app/index.tsx to customize this screen.</Text>

      <TouchableOpacity style={styles.button}>
        <FontAwesome name="sign-in" size={20} color="white" style={styles.icon} />
        <Link href="/authentication" style={styles.linkText}>
          Go to Auth Page!
        </Link>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <FontAwesome name="calendar" size={20} color="white" style={styles.icon} />
        <Link href="/pages/BookingPage" style={styles.linkText}>
          Go to Booking Page!
        </Link>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <FontAwesome name="location-arrow" size={20} color="white" style={styles.icon} />
        <Link href="/pages/RideTracking" style={styles.linkText}>
          Go to Ride Tracking!
        </Link>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  linkText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
