import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../views/screens/profile/ProfileScreen';
import EditProfile from '../views/screens/profile/EditProfile';
import ChangePassword from '../views/screens/profile/ChangePassword';
const Stack = createStackNavigator();
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="profile">
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="edit_profile" component={EditProfile} />
      <Stack.Screen name="change_pwd" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
