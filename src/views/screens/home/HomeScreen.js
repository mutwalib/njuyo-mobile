import {
  View,
  StyleSheet,
  BackHandler,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
import COLORS from '../../../consts/colors';
import Header from '../../../Navigation/Header';
import HeroBanner from '../../../components/HeroBanner';
import NearByRentals from '../../../components/NearByRentals';
import {getRentalsNearYou} from '../../../services/RentalService';
import SkeletonLoading from '../../../components/SkeletonLoading';

const HomeScreen = () => {
  const [rentals, setRentals] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchNearbyRentals = async location => {
    const results = await getRentalsNearYou(location);
    console.log(results);
    if (results !== null) {
      setRentals(results.content.slice(0, 6));
      setLoading(false);
    }
  };
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'App needs access to your location.',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted');
            getCurrentLocation();
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };
    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log(latitude);
          const googleLocation = `${latitude},${longitude}`;
          console.log(googleLocation, 'location');
          fetchNearbyRentals(googleLocation);
        },
        error => {
          console.log(error.message);
          setLoading(false);
        },
        {enableHighAccuracy: false, timeout: 40000, maximumAge: 10000},
      );
    };
    requestLocationPermission();
    // Clean up function
    return () => {
      // Clear any location watch or tasks here if needed
    };
  }, []);
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <Header />
      <HeroBanner />
      {loading ? (
        <View style={styles.loadingContainer}>
          <SkeletonLoading />
        </View>
      ) : (
        rentals && <NearByRentals nearByRentals={rentals} />
      )}
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
