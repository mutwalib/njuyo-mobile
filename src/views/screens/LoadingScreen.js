import React, {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Image,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {useDispatch} from 'react-redux';
import {setUser} from '../../store/userSlice';
import {whoAmI} from '../../services/AuthServices';
import Background from '../../components/Background';
import COLORS from '../../consts/colors';

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
      }
      navigation.navigate('Main');
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
      <Background>
        <View style={styles.container}>
          <Image
            source={require('../../assets/app-logo.png')} // Ensure you have a logo image in your assets folder
            style={styles.logo}
          />
          <Text style={styles.slogan}>Everywhere is Home</Text>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        </View>
      </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  slogan: {
    fontSize: 24, // Adjust font size as needed
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000', // Adjust color as needed
  },
  loader: {
    marginTop: 20,
  },
});

export default LoadingScreen;
