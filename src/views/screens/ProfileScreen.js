import React from 'react';
import PropTypes from 'prop-types';
import contactData from './profile/contact.json';

import Profile from './profile/Profile';
const ProfileScreen = () => <Profile {...contactData} />;
ProfileScreen.navigationOptions = () => ({
  header: null,
});
ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ProfileScreen;
