import React from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer';
import TabRoutes from './TabRoutes';
import ProfileScreen from '../views/screens/profile/ProfileScreen';
import {View, Text, Image} from 'react-native';
import Icon from '../consts/Icon';
import User from '../assets/user.jpg';
import navigationStrings from '../consts/navigationStrings';
import LoginScreen from '../views/screens/auth/LoginScreen';
import RegisterScreen from '../views/screens/auth/RegisterScreen';
import AuthStack from './AuthStack';
const Drawer = createDrawerNavigator();

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => {
        return (
          <SafeAreaView style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => props.navigation.closeDrawer()}
              style={{
                alignItems: 'flex-end',
                paddingRight: 10,
                paddingTop: 10,
              }}>
              <Icon type="fa" name="times" size={25} color="#000" />
            </TouchableOpacity>
            <View
              style={{
                height: 200,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: '#f4f4f4',
                borderBottomWidth: 1,
              }}>
              <Image
                source={User}
                style={{
                  height: 130,
                  width: 130,
                  borderRadius: 65,
                }}
              />
              <Text
                style={{
                  fontSize: 22,
                  marginVertical: 6,
                  fontWeight: 'bold',
                  color: '#111',
                }}>
                Bob Kirya
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#111',
                }}>
                Product Manager
              </Text>
            </View>
            <DrawerItemList {...props} />
          </SafeAreaView>
        );
      }}>
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: ({focused, color, size}) => (
            <Icon type="fa" name="home" size={size} color={color} />
          ),
        }}
        component={TabRoutes}
        name={navigationStrings.HOME}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: ({focused, color, size}) => (
            <Icon type="fa" name="sign-in" size={size} color={color} />
          ),
        }}
        component={AuthStack}
        name={navigationStrings.AUTH}
      />
      <Drawer.Screen
        name="Profile"
        options={{
          headerShown: false,
          drawerIcon: ({focused, color, size}) => (
            <Icon type="fa" name="user" size={size} color={color} />
          ),
        }}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="My Bookings"
        options={{
          headerShown: false,
          drawerIcon: ({focused, color, size}) => (
            <Icon type="fa" name="bookmark" size={size} color={color} />
          ),
        }}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="My Prospects"
        options={{
          headerShown: false,
          drawerIcon: ({focused, color, size}) => (
            <Icon type="fa" name="users" size={size} color={color} />
          ),
        }}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="My Properties"
        options={{
          headerShown: false,
          drawerIcon: ({focused, color, size}) => (
            <Icon type="fa" name="building" size={size} color={color} />
          ),
        }}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="Log out"
        options={{
          headerShown: false,
          drawerIcon: ({focused, color, size}) => (
            <Icon type="fa" name="sign-out" size={size} color={color} />
          ),
        }}
        component={ProfileScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerRoutes;
