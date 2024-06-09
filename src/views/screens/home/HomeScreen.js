import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import COLORS from '../../../consts/colors';
import Header from '../../../Navigation/Header';
import HeroBanner from '../../../components/HeroBanner';
import NearByRentals from '../../../components/NearByRentals';
import SkeletonLoading from '../../../components/SkeletonLoading';
import { useDispatch, useSelector } from 'react-redux';
import { getRentalsNearYou } from '../../../store/nearestRentalSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { nearestRentals, loading, error } = useSelector(state => state.nearestRentals);

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
          const { latitude, longitude } = position.coords;
          const googleLocation = `${latitude},${longitude}`;
          console.log(googleLocation, 'location');
          dispatch(getRentalsNearYou(googleLocation));
        },
        error => {
          console.log(error.message);
        },
        { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 },
      );
    };

    requestLocationPermission();

    return () => {
      // Clean up any location watch or tasks if needed
    };
  }, [dispatch]);

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
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor="gray"
      />
      <Header />
      <HeroBanner />
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <SkeletonLoading />
          </View>
        ) : (
          nearestRentals && <NearByRentals />
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
