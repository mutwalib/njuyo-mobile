import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, SafeAreaView, TouchableOpacity, Linking} from 'react-native';
import {
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import TabRoutes from './TabRoutes';
import ProfileScreen from '../views/screens/profile/ProfileScreen';
import {View, Text, Image} from 'react-native';
import Icon from '../consts/Icon';
import User from '../assets/profile.png';
import navigationStrings from '../consts/navigationStrings';
import LoginScreen from '../views/screens/auth/LoginScreen';
import RegisterScreen from '../views/screens/auth/RegisterScreen';
import AuthStack from './AuthStack';
import ProfileStack from './ProfileStack';
import MyProperties from '../views/screens/MyProperties/MyProperties';
import MyBookings from '../views/screens/MyBookings/MyBookings';
import MyProspects from '../views/screens/MyProspects/MyProspects';
import Icons from '../consts/icons';
import {logout} from '../store/authSlice';
import {setUser} from '../store/userSlice';
import PropertiesStack from './PropertiesStack';

const Drawer = createDrawerNavigator();

const DrawerRoutes = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setUser(null));
  };
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => {
        return (
          <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
              <View style={{flex: 1}}>
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
                    {user ? user.firstName + ' ' + user.lastName : 'Guest'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#111',
                    }}>
                    {user ? user.phone : ''}
                  </Text>
                </View>
                <DrawerItemList {...props} />
                {user && (
                  <DrawerItem
                    icon={({focused, color, size}) => (
                      <Icon
                        type="fa"
                        name="sign-out"
                        size={size}
                        color={color}
                      />
                    )}
                    label={`Log out`}
                    onPress={handleLogout}
                  />
                )}
              </View>
              <TouchableOpacity
                style={{marginBottom: 20, marginLeft: 30}}
                onPress={() => Linking.openURL('https://njuyo.com/privacy-policy')}>
                <Text>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
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
      {user ? (
        <>
          <Drawer.Screen
            name="Profile"
            options={{
              headerShown: false,
              drawerIcon: ({focused, color, size}) => (
                <Icon type="fa" name="user" size={size} color={color} />
              ),
            }}
            component={ProfileStack}
          />
          <Drawer.Screen
            name="My Bookings"
            options={{
              headerShown: false,
              drawerIcon: ({focused, color, size}) => (
                <Icon type="fa" name="bookmark" size={size} color={color} />
              ),
            }}
            component={MyBookings}
          />
          {user.roles && user.roles.includes('OWNER') && (
            <>
              <Drawer.Screen
                name="My Prospects"
                options={{
                  headerShown: false,
                  drawerIcon: ({focused, color, size}) => (
                    <Icon type="fa" name="users" size={size} color={color} />
                  ),
                }}
                component={MyProspects}
              />
              <Drawer.Screen
                name="My Properties"
                options={{
                  headerShown: false,
                  drawerIcon: ({focused, color, size}) => (
                    <Icon type="fa" name="building" size={size} color={color} />
                  ),
                }}
                component={PropertiesStack}
              />
            </>
          )}
        </>
      ) : (
        <>
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
            options={{
              headerShown: false,
              drawerIcon: ({focused, color, size}) => (
                <Icon type="fa" name="user-plus" size={size} color={color} />
              ),
            }}
            component={RegisterScreen}
            name={navigationStrings.SIGNUP}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default DrawerRoutes;
