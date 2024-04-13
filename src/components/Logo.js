import React from 'react';
import {Image, StyleSheet} from 'react-native';
import imagePath from '../consts/imagePath';

export default function Logo() {
  return (
    <Image source={imagePath.logoLabelled} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
});