import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FONTS, SIZES, imagePath} from '../../../consts';
import COLORS from '../../../consts/colors';
import Icon from '../../../consts/Icon';
import {useSelector, useDispatch} from 'react-redux';
import BackHeader from '../../../Navigation/BackHeader';
import axios from 'axios';
import {logout} from '../../../store/userSlice';
import {bURL} from '../../../services/api/api';
import {roleApplicationStatus} from '../../../store/roleApplicationStatusSlice';
import {applyForAgentRole} from '../../../services/AuthServices';
import {Tooltip} from 'react-native-elements';
import StatBadge from '../../../components/statBadge';

const ProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const {isApplied, status, error} = useSelector(
    state => state.applicationStatus,
  );

  useEffect(() => {
    if (user && user.id) {
      dispatch(roleApplicationStatus(user.id));
    }
  }, [dispatch, user]);

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
  };

  const handleApplyForOwner = async () => {
    try {
      const data = {
        userId: user.id,
        roleName: 'OWNER',
      };
      const response = await applyForAgentRole(data);
      console.log(response);
      if (response.status === 200) {
        dispatch(roleApplicationStatus(user.id));
        Alert.alert(response._response);
      } else {
        Alert.alert(
          'Error',
          'There was an issue submitting your application. Please try again.',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'There was an issue submitting your application. Please try again.',
      );
    }
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
            height: 130,
            width: 130,
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
          {!user.roles.includes('OWNER') &&
            (isApplied ? (
              <Text
                style={{
                  width: '90%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.gray,
                }}>
                You applied to be an agent, Your application is pending approval
              </Text>
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  marginHorizontal: SIZES.padding,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    width: 124,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.blue,
                    borderRadius: 10,
                    marginHorizontal: SIZES.padding * 2,
                  }}
                  onPress={handleApplyForOwner}>
                  <Text style={{...FONTS.body4, color: COLORS.white}}>
                    Apply as OWNER
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
        <View style={{flexDirection: 'row'}}>
          <StatBadge number="0" label="Rented" />
          <StatBadge number="3" label="Bought" />
          {user.roles && user.roles.includes('OWNER') && (
            <>
              <StatBadge number="0" label="My Rentals" />
              <StatBadge number="0" label="My Land" />
              <StatBadge number="0" label="My Hostels" />
            </>
          )}
        </View>
        <View
          style={{flexDirection: 'row', marginTop: 50, paddingHorizontal: 10}}>
          <TouchableOpacity
            style={{
              width: 70,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.green,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={handleEditProfile}>
            <Tooltip popover={<Text>Edit Profile</Text>}>
              <Icon type="fa" name="edit" size={20} color={COLORS.white} />
            </Tooltip>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 70,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={handleChangePassword}>
            <Tooltip popover={<Text>Change Password</Text>}>
              <Icon type="fa" name="lock" size={20} color={COLORS.white} />
            </Tooltip>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 70,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.red,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={handleDeleteAccount}>
            <Tooltip popover={<Text>Delete Account</Text>}>
              <Icon type="fa" name="trash" size={20} color={COLORS.white} />
            </Tooltip>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
