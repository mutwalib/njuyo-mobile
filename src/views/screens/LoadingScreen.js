import React, {useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {useDispatch} from 'react-redux';
import {setUser} from '../../store/userSlice';
import {whoAmI} from '../../services/AuthServices';
const LoadingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    const checkGPSAndToken = async () => {
      const isPermissionGranted = await checkAppLocationPermission();
      if (isPermissionGranted) {
        const isLocationEnabled = await enableLocationService();
        if (!isLocationEnabled) {
          navigation.navigate('Exit');
          return;
        }
      } else {
        navigation.navigate('Exit');
        return;
      }
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await whoAmI();
        dispatch(setUser(response));
        navigation.navigate('Main');
      } else {
        navigation.navigate('Authenticate');
      }
    };

    const timeout = setTimeout(() => {
      checkGPSAndToken();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [dispatch, navigation]);
  const enableLocationService = async () => {
    try {
      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });
      return true;
    } catch (error) {
      return false;
    }
  };
  const checkAppLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};
export default LoadingScreen;
