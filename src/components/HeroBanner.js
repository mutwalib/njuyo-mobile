import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import imagePath from '../consts/imagePath';

const HeroBanner = () => {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const handleInquiryOpenBtn = () => {
    setIsInquiryOpen(true);
  };
  return (
    <ImageBackground
      source={imagePath.bannerImg}
      style={styles.heroBanner}
      resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Explore our new{' '}
            <Text style={styles.bold}>properties in your area</Text> today ...
          </Text>
          <View style={styles.buttonContainer}>
            {isInquiryOpen ? (
              <></>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleInquiryOpenBtn}>
                <Text style={styles.buttonText}>Inquire</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  heroBanner: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    maxWidth: 1280,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default HeroBanner;
