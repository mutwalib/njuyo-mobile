import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import OnBoardScreen from '../views/screens/OnBoardScreen';
import LoadingScreen from '../views/screens/LoadingScreen';
import DrawerRoutes from './DrawerRoutes';
import ExitScreen from '../views/screens/ExitScreen';
import Background from '../components/Background';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import '../config/firebaseConfig';
import AddRentalScreen from '../views/screens/AddRentalScreen';
import RentalDetailsScreen from '../views/screens/RentalDetailsScreen';
import AddLandScreen from '../views/screens/AddLandScreen';
import EditRentalScreen from '../views/screens/EditRentalScreen';
import MyProperties from '../views/screens/MyProperties/MyProperties';
import RentalBookings from '../views/screens/RentalBookings';
import BookingDetailsScreen from '../views/screens/RentalBookingDetails';
import navigationStrings from '../consts/navigationStrings';
import RegisterScreen from '../views/screens/auth/RegisterScreen';
import LoginScreen from '../views/screens/auth/LoginScreen';
import ProfileScreen from '../views/screens/profile/ProfileScreen';
import ChangePassword from '../views/screens/profile/ChangePassword';
import EditProfile from '../views/screens/profile/EditProfile';

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
      <Stack.Screen name="my_properties" component={MyProperties} />
      <Stack.Screen name="rental_bookings" component={RentalBookings} />
      <Stack.Screen
        name="BookingDetailsScreen"
        component={BookingDetailsScreen}
      />
      <Stack.Screen name="rental_details" component={RentalDetailsScreen} />
      <Stack.Screen name="add_rental" component={AddRentalScreen} />
      <Stack.Screen name="add_land" component={AddLandScreen} />
      <Stack.Screen name="edit_rental" component={EditRentalScreen} />
      <Stack.Screen
        name={navigationStrings.SIGNUP}
        component={RegisterScreen}
      />
      <Stack.Screen name={navigationStrings.SIGNIN} component={LoginScreen} />
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="change_pwd" component={ChangePassword} />
      <Stack.Screen name="edit_profile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export default StartStack;
