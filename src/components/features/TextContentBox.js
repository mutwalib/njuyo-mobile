import React from 'react';
import { View, Text } from 'react-native';

const TextContentBox = ({ title, children }) => {
  return (
    <View style={{ backgroundColor: 'white', padding: '1.5rem', marginBottom: '1rem' }}>
      <Text style={{ fontSize: '1.5rem', fontWeight: 'light', color: 'gray.600', marginBottom: '0.5rem' }}>
        {title}
      </Text>
      <View style={{ height: 1, backgroundColor: 'gray', marginVertical: '0.7rem' }} />
      {children}
    </View>
  );
};

export default TextContentBox;
