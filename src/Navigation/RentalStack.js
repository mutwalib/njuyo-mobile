import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import navigationStrings from '../consts/navigationStrings';
import RentalListingScreen from '../../src/views/screens/rentals/RentalListingScreen';
import RentalDetailsScreen from '../../src/views/screens/rentals/RentalDetailsScreen';
const Stack = createStackNavigator();
const RentalStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={navigationStrings.RENTAL}
        component={RentalListingScreen}
      />
      <Stack.Screen name="rental_details" component={RentalDetailsScreen} />
    </Stack.Navigator>
  );
};

export default RentalStack;
