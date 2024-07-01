import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import OnBoardScreen from '../views/screens/OnBoardScreen';
import LoadingScreen from '../views/screens/LoadingScreen';
import DrawerRoutes from './DrawerRoutes';
import ExitScreen from '../views/screens/ExitScreen';
import LoginScreen from '../views/screens/auth/LoginScreen';
import Background from '../components/Background';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import '../config/firebaseConfig';

const Stack = createStackNavigator();
const StartStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize('64bab68b-0cc0-4f50-96da-635b2728d5fc');
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched')
      .then(value => {
        if (value === null) {
          AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      })
      .catch(error => {
        console.error('Error fetching data from AsyncStorage:', error);
      });
  }, []);
  // Render this until the isFirstLaunch state is determined
  if (isFirstLaunch === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Background>
          <Text>Loading ...</Text>
        </Background>
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isFirstLaunch && (
        <Stack.Screen name="OnBoard" component={OnBoardScreen} />
      )}
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Exit" component={ExitScreen} />
      <Stack.Screen name="Main" component={DrawerRoutes} />
      <Stack.Screen name="Authenticate" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default StartStack;
