import React from 'react';
import {StyleSheet} from 'react-native';
import COLORS from '../../consts/colors';
import {useNavigation} from '@react-navigation/native';
import {View, Image, Text} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const Header = props => {
  const navigation = useNavigation();
  return (
    <View style={style.header}>
      <View>
        <Text style={{color: COLORS.grey}}>Location</Text>
        <Text style={{color: COLORS.dark, fontSize: 20, fontWeight: 'bold'}}>
          Uganda
        </Text>
      </View>
      <Pressable onPress={() => navigation.navigate('Settings')}>
        <Image
          source={require('../../assets/profile.png')}
          style={style.profileImg}
        />
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});
export default Header;
