import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import OnBoardScreen from './src/views/screens/OnBoardScreen';
import HomeScreen from './src/views/screens/HomeScreen';
import RentalDetailsScreen from './src/views/screens/RentalDetailsScreen';
import RegisterScreen from './src/views/screens/RegisterScreen';
import LoginScreen from './src/views/screens/LoginScreen';
import ResetPasswordScreen from './src/views/screens/ResetPasswordScreen';
import ProfileScreen from './src/views/screens/ProfileScreen';
import Settings from './src/views/screens/settings/Settings';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="RentalDetailsScreen"
          component={RentalDetailsScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
