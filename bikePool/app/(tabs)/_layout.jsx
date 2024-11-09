import React from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { FontAwesome5, MaterialIcons,MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const tabAnimations = {
    home: React.useRef(new Animated.Value(1)).current,
    rides: React.useRef(new Animated.Value(1)).current,
    profile: React.useRef(new Animated.Value(1)).current,
  };

  const animateTab = (tab, focused) => {
    Animated.spring(tabAnimations[tab], {
      toValue: focused ? 1.2 : 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          backgroundColor: '#FFFFFF',
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#8F8F8F',
        tabBarLabel: ({ focused }) => {
          const labels = {
            home: 'Home',
            'rides/index': 'Rides',
            'profile/index': 'Profile',
          };
          return (
            <Animated.Text
              style={{
                fontSize: 12,
                color: focused ? '#6C63FF' : '#8F8F8F',
                marginTop: -5,
                opacity: focused ? 1 : 0.8,
              }}
            >
              {labels[route.name]}
            </Animated.Text>
          );
        },
        tabBarIcon: ({ focused }) => {
          const tabName = route.name.split('/')[0];
          
          // Animate the tab when focus changes
          React.useEffect(() => {
            animateTab(tabName, focused);
          }, [focused]);

          const iconSize = 24;
          let icon;

          if (route.name === 'home') {
            icon = (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={iconSize}
                color={focused ? '#6C63FF' : '#8F8F8F'}
              />
            );
          } else if (route.name === 'rides/index') {
            icon = (
              <MaterialCommunityIcons
                name={focused ? 'motorbike' : 'motorbike'}
                size={iconSize}
                color={focused ? '#FF6B6B' : '#8F8F8F'}
              />
            );
          } else if (route.name === 'profile/index') {
            icon = (
              <FontAwesome5
                name={focused ? 'user-alt' : 'user'}
                size={iconSize - 2}
                color={focused ? '#4ECDC4' : '#8F8F8F'}
              />
            );
          }

          return (
            <Animated.View
              style={{
                transform: [{ scale: tabAnimations[tabName] }],
                backgroundColor: focused ? '#F0EFFE' : 'transparent',
                borderRadius: 12,
                padding: 8,
              }}
            >
              {icon}
            </Animated.View>
          );
        },
      })}
    >
      <Tabs.Screen 
        name="home"
        options={{
          tabBarItemStyle: {
            paddingVertical: 5,
          },
        }}
      />
      <Tabs.Screen 
        name="rides/index"
        options={{
          tabBarItemStyle: {
            paddingVertical: 5,
          },
        }}
      />
      <Tabs.Screen 
        name="profile/index"
        options={{
          tabBarItemStyle: {
            paddingVertical: 5,
          },
        }}
      />
    </Tabs>
  );
}