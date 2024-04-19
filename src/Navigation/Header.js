import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from 'react-native';
import {useSelector} from 'react-redux';
import COLORS from '../consts/colors';
import icons from '../consts/icons';
import {useNavigation} from '@react-navigation/native';

const Header = ({title, onPressMore}) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.user.user);
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.iconContainer}>
          <Image
            resizeMode="contain"
            style={styles.icon}
            source={icons.hamburger}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 12,
            fontSize: 17,
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
      </View>
      {user ? (
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 16}}>
          <TouchableOpacity onPress={'load notifications'}>
            <Image
              resizeMode="contain"
              style={styles.icon}
              source={icons.bell}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressMore}
            style={[styles.iconContainer, {marginLeft: 16}]}>
            <Image
              resizeMode="contain"
              style={styles.icon}
              source={icons.more}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.btnContainer, {marginRight: 16}]}>
          <Button
            style={[styles.signInBtn, {backgroundColor: COLORS.red}]}
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 0,
    backgroundColor: COLORS.black,
    paddingBottom: 8,
    marginBottom: 1,
  },
  iconContainer: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white,
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
  },
  signInBtn: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
