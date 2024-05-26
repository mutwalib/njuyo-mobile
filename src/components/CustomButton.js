import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const CustomButton = ({
  label,
  disabled,
  onPress,
  isMyOwn,
  isBooked,
  isHovered,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isMyOwn && styles.ownerButton,
        isBooked && styles.bookedButton,
        isHovered && styles.hoveredButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text
        style={[
          styles.buttonText,
          isBooked && styles.bookedButtonText,
          isMyOwn && styles.ownerButtonText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#d50000',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  ownerButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  ownerButtonText: {
    color: '#4CAF50',
  },
  bookedButton: {
    borderColor: '#161d34',
  },
  bookedButtonText: {
    color: '#161d34',
  },
  hoveredButton: {
    backgroundColor: '#161d34',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'inherit',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#d50000',
  },
});

export default CustomButton;
