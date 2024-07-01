import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FONTS, SIZES, imagePath} from '../../../consts';
import COLORS from '../../../consts/colors';
import Icon from '../../../consts/Icon';
import {useSelector, useDispatch} from 'react-redux';
import BackHeader from '../../../Navigation/BackHeader';
import axios from 'axios';
import {logout} from '../../../store/userSlice'; // Assuming there's a logout action in userSlice
import {bURL} from '../../../services/api/api';

const ProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const handleEditProfile = () => {
    navigation.navigate('edit_profile');
  };

  const handleChangePassword = () => {
    navigation.navigate('change_pwd');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: deleteAccount, style: 'destructive'},
      ],
      {cancelable: false},
    );
  };

  const deleteAccount = async () => {
    try {
      const response = await axios.delete(`${bURL}/api/user/${user.id}`);
      if (response.status === 200) {
        Alert.alert(
          'Account Deleted',
          'Your account has been deleted successfully.',
        );
        dispatch(logout());
        navigation.navigate('Login');
      } else {
        Alert.alert(
          'Error',
          'There was an issue deleting your account. Please try again.',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'There was an issue deleting your account. Please try again.',
      );
    } 
    // finally {
    //   Linking.openURL('https://njuyo.com/delete-account');
    // }
  };
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <BackHeader navigation={navigation} title={`Profile`} />
      <View style={{width: '100%'}}>
        <Image
          source={imagePath.cover}
          resizeMode="cover"
          style={{height: 228, width: '100%'}}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          source={imagePath.icProfile}
          resizeMode="contain"
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: COLORS.primary,
            borderWidth: 2,
            marginTop: -90,
          }}
        />
        <Text style={{...FONTS.h3, color: COLORS.primary, marginVertical: 8}}>
          {user && user.firstName + ' ' + user.lastName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 6,
            alignItems: 'center',
          }}>
          <Icon type="fa" name="phone" size={20} color="#000" />
          <Text style={{color: COLORS.black, ...FONTS.body4}}>
            {user ? user.phone : ''}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 6,
            alignItems: 'center',
          }}>
          <Icon type="fa" name="envelope" size={20} color="#000" />
          <Text style={{...FONTS.body4, marginLeft: 4}}>
            {user ? user.email : ''}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginHorizontal: SIZES.padding,
            }}>
            <Text style={{...FONTS.h2, color: COLORS.primary}}>0</Text>
            <Text style={{...FONTS.body4, color: COLORS.primary}}>Rented</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginHorizontal: SIZES.padding,
            }}>
            <Text style={{...FONTS.h2, color: COLORS.primary}}>67</Text>
            <Text style={{...FONTS.body4, color: COLORS.primary}}>Bought</Text>
          </View>
          {user.roles && user.roles.includes('OWNER') && (
            <>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginHorizontal: SIZES.padding,
                }}>
                <Text style={{...FONTS.h2, color: COLORS.primary}}>0</Text>
                <Text style={{...FONTS.body4, color: COLORS.primary}}>
                  My Rentals
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginHorizontal: SIZES.padding,
                }}>
                <Text style={{...FONTS.h2, color: COLORS.primary}}>0</Text>
                <Text style={{...FONTS.body4, color: COLORS.primary}}>
                  My Land
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginHorizontal: SIZES.padding,
                }}>
                <Text style={{...FONTS.h2, color: COLORS.primary}}>0</Text>
                <Text style={{...FONTS.body4, color: COLORS.primary}}>
                  My Hostels
                </Text>
              </View>
            </>
          )}
        </View>
        <View style={{flexDirection: 'row', marginTop: 50}}>
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.green,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={handleEditProfile}>
            <Text style={{...FONTS.body4, color: COLORS.white}}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={handleChangePassword}>
            <Text style={{...FONTS.body4, color: COLORS.white}}>
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginTop: 40}}>
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.red,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={handleDeleteAccount}>
            <Text style={{...FONTS.body4, color: COLORS.white}}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
