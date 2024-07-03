import React from 'react';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import navigationStrings from '../consts/navigationStrings';
// import HomeStack from './HomeStack';
// import RentalStack from './RentalStack';
import {Image} from 'react-native';
import COLORS from '../consts/colors';
import icons from '../consts/icons';
import HomeScreen from '../views/screens/home/HomeScreen';
import RentalListingScreen from '../views/screens/rentals/RentalListingScreen';
const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  return (
    <Tab.Navigator
      initialRouteName={navigationStrings.HOME}
      screenOptions={({route}) => (
        {
          tabBarStyle: (route => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (routeName === 'rental_details') {
              return {display: 'none'};
            }
            return;
          })(route),
        },
        {
          headerShown: false,
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false,
          tabBarStyle: {
            //position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            elevation: 0,
            height: Platform.OS === 'ios' ? 90 : 60,
            backgroundColor: COLORS.lightGray,
          },
        }
      )}>
      <Tab.Screen
        name={navigationStrings.INITIALBTMTAB}
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={focused ? icons.home : icons.homeOutline}
                resizeMode="contain"
                style={{
                  height: 24,
                  width: 24,
                  tintColor: focused ? COLORS.activeIndicator : COLORS.primary,
                }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={navigationStrings.RENTALS}
        component={RentalListingScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={focused ? icons.houseRental : icons.houseRentalOutline}
                resizeMode="contain"
                style={{
                  height: 24,
                  width: 24,
                  tintColor: focused ? COLORS.activeIndicator : COLORS.primary,
                }}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;
