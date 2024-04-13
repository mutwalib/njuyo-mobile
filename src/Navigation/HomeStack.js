import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../views/screens/home/HomeScreen';
import navigationStrings from '../consts/navigationStrings';
const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.HOME} component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
