import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
const Stamp = ({stampLabel}) => {
  return (
    <View style={styles.stamp}>
      <Text style={styles.label}>{stampLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stamp: {
    width: 50,
    height: 50,
    backgroundColor: 'yellow',
    borderRadius: 25,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#888888',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2, // This is for Android shadow
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Stamp;
