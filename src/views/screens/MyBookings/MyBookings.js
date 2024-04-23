import React, {useEffect} from 'react';
import {SafeAreaView, Text, BackHandler} from 'react-native';
import BackHeader from '../../../Navigation/BackHeader';
const MyBookings = ({navigation}) => {
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView>
      <BackHeader navigation={navigation} title={`My Bookings`} />
      <Text>Coming Soon!</Text>
    </SafeAreaView>
  );
};

export default MyBookings;
