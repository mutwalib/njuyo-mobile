import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import navigationStrings from '../consts/navigationStrings';
import LoginScreen from '../views/screens/auth/LoginScreen';
import RegisterScreen from '../views/screens/auth/RegisterScreen';
import ResetPasswordScreen from '../views/screens/auth/ResetPasswordScreen';
const Stack = createStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={navigationStrings.SIGNIN}>
      <Stack.Screen name={navigationStrings.SIGNIN} component={LoginScreen} />
      <Stack.Screen
        name={navigationStrings.SIGNUP}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={navigationStrings.RESETPASS}
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
