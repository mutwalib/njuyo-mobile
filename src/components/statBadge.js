import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FONTS, SIZES} from '../consts';
import COLORS from '../consts/colors';

const StatBadge = ({number, label}) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.number}>{number}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  number: {
    ...FONTS.h4,
    color: COLORS.white,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
});

export default StatBadge;
