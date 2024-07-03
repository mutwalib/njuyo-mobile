import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  Button,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import COLORS from '../../../consts/colors';
import Header from '../../../Navigation/Header';
import HeroBanner from '../../../components/HeroBanner';
import NearByRentals from '../../../components/NearByRentals';
import SkeletonLoading from '../../../components/SkeletonLoading';
import {useDispatch, useSelector} from 'react-redux';
import {getRentalsNearYou} from '../../../store/nearestRentalSlice';
import BottomSheet from '../../../components/BottomSheet';
import {toggleInquiryOpen} from '../../../store/inquirySlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();
  const {nearestRentals, loading, error} = useSelector(
    state => state.nearestRentals,
  );
  const isInquiryOpen = useSelector(state => state.inquiry.isInquiryOpen);
  const handleClose = () => {
    bottomSheetRef.current?.close();
    dispatch(toggleInquiryOpen());
  };
  const handleAddInquiry = () => {};
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
          const googleLocation = `${latitude},${longitude}`;
          console.log(googleLocation, 'location');
          dispatch(getRentalsNearYou(googleLocation));
        },
        error => {
          console.log(error.message);
        },
        {enableHighAccuracy: false, timeout: 40000, maximumAge: 10000},
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
    if (isInquiryOpen) {
      bottomSheetRef.current.open();
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
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
      <BottomSheet bottomSheetRef={bottomSheetRef}>
        <View style={styles.modalBackground}>
          <View style={styles.bottomSheetContainer}>
            <Text style={styles.title}>Inquiry Form</Text>
            <TextInput placeholder="Name" style={styles.input} />
            <TextInput placeholder="Email" style={styles.input} />
            <TextInput placeholder="Message" style={styles.input} multiline />
            <Button title="Submit" onPress={handleAddInquiry} />
            <Button title="Close" onPress={handleClose} color="red" />
          </View>
        </View>
      </BottomSheet>
    </>
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
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});
