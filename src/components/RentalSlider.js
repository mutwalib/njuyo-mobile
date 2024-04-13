import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import RentalCard from './rental/RentalCard';

const RentalSlider = ({nearbyRentals}) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.sliderContainer}>
      {nearbyRentals &&
        nearbyRentals.map(rental => (
          <View key={rental.id} style={styles.slide}>
            <RentalCard rental={rental} />
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    paddingHorizontal: 1,
  },
  slide: {
    marginRight: 1,
  },
});

export default RentalSlider;
