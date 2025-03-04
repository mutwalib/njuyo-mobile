import React, {useEffect} from 'react';
import {SafeAreaView, Text, BackHandler} from 'react-native';
import BackHeader from '../../../Navigation/BackHeader';
const MyProspects = ({navigation}) => {
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
      <BackHeader navigation={navigation} title={`My Prospects`} />
      <Text>Coming Soon!</Text>
    </SafeAreaView>
  );
};

export default MyProspects;
