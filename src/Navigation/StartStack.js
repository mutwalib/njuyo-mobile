import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import OnBoardScreen from '../views/screens/OnBoardScreen';
import LoadingScreen from '../views/screens/LoadingScreen';
import DrawerRoutes from './DrawerRoutes';
const Stack = createStackNavigator();
const StartStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
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
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={isFirstLaunch ? 'OnBoard' : 'Loading'}>
      {isFirstLaunch ? (
        <Stack.Screen name="OnBoard" component={OnBoardScreen} />
      ) : (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      )}
      <Stack.Screen name="Main" component={DrawerRoutes} />
    </Stack.Navigator>
  );
};

export default StartStack;
