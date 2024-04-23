import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../views/screens/home/HomeScreen';
import navigationStrings from '../consts/navigationStrings';
import RentalDetailsScreen from '../views/screens/RentalDetailsScreen';
const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.HOME} component={HomeScreen} />
      <Stack.Screen name="rental_details" component={RentalDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
