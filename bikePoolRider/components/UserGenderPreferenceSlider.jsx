import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const UserGenderPreferenceSlider = ({ user, onPreferenceChange }) => {
  const [selectedPreference, setSelectedPreference] = useState(user.userGenderPreference);
  const options = user.gender === 'Male' ? ["Male", "Both"] : [ "Female", "Both"];

  const handleSelection = (preference) => {
    setSelectedPreference(preference);
    onPreferenceChange(preference); 
  };

  const getSelectedStyle = (preference) => {
    switch (preference) {
      case "Male":
        return { backgroundColor: '#041E42', borderColor: '#00008B' };
      case "Female":
        return { backgroundColor: '#AA336A', borderColor: '#C51162' }; 
      case "Both":
        return { backgroundColor: '#4CAF50', borderColor: '#388E3C' };
      default:
        return {};
    }
  };

  return (
    <View style={styles.infoItem}>
      <View>
        <Text style={styles.infoLabel}>User Gender Preference</Text>
      </View>
      <View style={styles.sliderContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.sliderOption,
              selectedPreference === option && styles.selectedOption,
              selectedPreference === option && getSelectedStyle(option), 
            ]}
            onPress={() => handleSelection(option)}
          >
            <Text
              style={[
                styles.sliderText,
                selectedPreference === option && styles.selectedText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: 'column',
    gap: 10,
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderOption: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedOption: {
    borderWidth: 2,
  },
  sliderText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default UserGenderPreferenceSlider;
