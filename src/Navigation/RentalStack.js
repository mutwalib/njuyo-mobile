import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import navigationStrings from '../consts/navigationStrings';
import RentalListingScreen from '../../src/views/screens/rentals/RentalListingScreen';
import RentalDetailsScreen from '../views/screens/RentalDetailsScreen';
import EditRentalScreen from '../views/screens/EditRentalScreen';
const Stack = createStackNavigator();
const RentalStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={navigationStrings.RENTAL}
        component={RentalListingScreen}
      />
      <Stack.Screen name="rental_details" component={RentalDetailsScreen} />
      <Stack.Screen name="update_rental" component={EditRentalScreen} />
    </Stack.Navigator>
  );
};

export default RentalStack;
