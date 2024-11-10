import React from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

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
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'rgba(40, 40, 40, 0.7)',
          borderRadius: 20,
          margin: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#666666',
        tabBarIcon: ({ focused }) => {
          const tabName = route.name.split('/')[0];
          
          React.useEffect(() => {
            animateTab(tabName, focused);
          }, [focused]);

          const iconSize = 22;
          let icon;

          if (route.name === 'home') {
            icon = (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={iconSize}
                color={focused ? '#FFFFFF' : '#666666'}
              />
            );
          } else if (route.name === 'rides/index') {
            icon = (
              <MaterialCommunityIcons
                name={focused ? 'motorbike' : 'motorbike'}
                size={iconSize}
                color={focused ? '#FFFFFF' : '#666666'}
              />
            );
          } else if (route.name === 'profile/index') {
            icon = (
              <FontAwesome5
                name={focused ? 'user-alt' : 'user'}
                size={iconSize - 2}
                color={focused ? '#FFFFFF' : '#666666'}
              />
            );
          }

          return (
            <Animated.View
              style={{
                transform: [{ scale: tabAnimations[tabName] }],
                backgroundColor: focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderRadius: 12,
                padding: 10,
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