import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Image, Text} from 'react-native';

const ComponentHeader = props => {
  return (
    <View style={style.header}>
      <Image
        source={require('../assets/profile.png')}
        style={style.profileImg}
        resizeMode="contain"
      />
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
export default ComponentHeader;
