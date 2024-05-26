import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AddRentalScreen from '../views/screens/AddRentalScreen';
import MyProperties from '../views/screens/MyProperties/MyProperties';
import AddLandScreen from '../views/screens/AddLandScreen';
import RentalBookings from '../views/screens/RentalBookings';
import RentalDetailsScreen from '../views/screens/RentalDetailsScreen';
const Stack = createStackNavigator();
const PropertiesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="my_properties">
      <Stack.Screen name="my_properties" component={MyProperties} />
      <Stack.Screen name="rental_bookings" component={RentalBookings} />
      <Stack.Screen name="rental-details" component={RentalDetailsScreen} />
      <Stack.Screen name="add_rental" component={AddRentalScreen} />
      <Stack.Screen name="add_land" component={AddLandScreen} />
    </Stack.Navigator>
  );
};

export default PropertiesStack;
