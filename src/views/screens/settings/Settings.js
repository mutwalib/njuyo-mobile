import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import SettingsComponent from '../../components/SettingsComponent';

const Settings = () => {
  const [email, setEmail] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const navigation = useNavigation();
  const saveSetting = (key, value) => {
    AsyncStorage.setItem(key, value);
  };

  const settingsOptions = [
    {
      title: 'My Info',
      subTitle: 'Set up your profile here',
      onPress: () => {
        navigation.navigate('ProfileScreen');
      },
    },
    {
      title: 'My Account',
      subTitle: 'set up your Account here',
      onPress: () => {},
    },
    {
      title: 'My Bookings',
      subTitle: 'Find your booking history here',
      onPress: () => {},
    },
    {
      title: 'My Properties',
      subTitle: 'Find and manage your properties here',
      onPress: () => {},
    },
    {
      title: 'My Favorites',
      subTitle: 'Find your favorites here',
      onPress: () => {},
    },
    {
      title: 'Booking Appointments',
      subTitle: 'Find your appointments here',
      onPress: () => {},
    },
    {
      title: 'Landlord zone',
      subTitle: 'Find your tenants and customers',
      onPress: () => {},
    },
    {
      title: 'Transaction History',
      subTitle: 'Find your successful transactions here',
      onPress: () => {},
    },
  ];

  const getSettings = async () => {
    const user = await AsyncStorage.getItem('user');
    setEmail(JSON.parse(user).email);

    const sortPref = await AsyncStorage.getItem('sortBy');
    if (sortPref) {
      setSortBy(sortPref);
    }
  };
  useEffect(() => {
    getSettings();
  }, []);

  return <SettingsComponent settingsOptions={settingsOptions} />;
};

export default Settings;
