import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import {COLORS, FONTS, SIZES, imagePath} from '../../../consts';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import BackHeader from '../../../Navigation/BackHeader';
import RentalBookingScene from './RentalBookingScene';
import LandBookingScene from './LandBookingScene';
const renderScene = SceneMap({
  rentals: RentalBookingScene,
  land: LandBookingScene,
});

const MyBookings = ({navigation}) => {

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
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
  const [routes] = useState([
    {key: 'rentals', title: 'Rental'},
    {key: 'land', title: 'Land'},
  ]);
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: COLORS.white,
        height: 44,
      }}
      renderLabel={({focused, route}) => (
        <Text style={[{color: focused ? COLORS.black : COLORS.gray2}]}>
          {route.title}
        </Text>
      )}
    />
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <BackHeader navigation={navigation} title={`My Bookings`} />
      <View style={{flex: 1, marginHorizontal: 1, marginTop: 8}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
};

export default MyBookings;
