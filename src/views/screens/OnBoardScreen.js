import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
  View,
  Text,
  Pressable,
} from 'react-native';
import COLORS from '../../consts/colors';
import { useNavigation } from '@react-navigation/native';

const OnBoardScreen = () => {
  const navigation = useNavigation();
  const handleGetStarted = () => {
    navigation.navigate('Loading');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar translucent backgroundColor={COLORS.transparent} />
      <Image source={require('../../assets/house1.jpg')} style={style.image} />
      <View style={style.indicatorContainer}>
        <View style={style.indicator} />
        <View style={style.indicator} />
        <View style={[style.indicator, style.indicatorActive]} />
      </View>
      <View style={{paddingHorizontal: 20, paddingTop: 5}}>
        <View>
          <Text style={style.title}>Find Your Dream Property.</Text>
          <Text style={style.title}>
            Rent or Buy a Room, House, Hostel, Hotel or Land In your favorite
            location around the country.
          </Text>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={style.textStyle}>Schedule a visit in a few clicks</Text>
          <Text style={style.textStyle}>Book your property now!</Text>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 40}}>
        <Pressable onPress={handleGetStarted}>
          <View style={style.btn}>
            <Text style={{color: COLORS.white}}> Get Started</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  image: {height: 420, width: '100%', borderBottomLeftRadius: 100},
  indicatorContainer: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 3,
    width: 30,
    backgroundColor: COLORS.grey,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  indicatorActive: {backgroundColor: COLORS.dark},
  title: {fontSize: 16, fontWeight: 'bold'},
  textStyle: {fontSize: 13, color: COLORS.grey},
  btn: {
    height: 60,
    marginHorizontal: 20,
    backgroundColor: COLORS.dark,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default OnBoardScreen;
