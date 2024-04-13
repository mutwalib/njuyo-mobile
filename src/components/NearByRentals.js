import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RentalSlider from './RentalSlider';

const NearByRentals = ({ nearByRentals }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Get the nearest rental in your area
        </Text>
        <Text style={styles.subtitle}>
          Our selected vacant rentals now in this area 
        </Text>
        <RentalSlider nearbyRentals={nearByRentals} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F4F8',
  },
  content: {
    maxWidth: '100%',
    marginHorizontal: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 8,
    color: '#374151',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 15,
    color: '#6B7280',
  },
});

export default NearByRentals;
