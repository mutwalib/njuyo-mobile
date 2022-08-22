import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import COLORS from '../../consts/colors';

const SearchComponent = () => {
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <View style={style.searchInputContainer}>
          <Icon name="search" size={25} color={COLORS.grey} />
          <TextInput placeholder="Search Village, City or any location" />
        </View>
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <View style={style.sortBtn}>
            <Icon name="tune" color={COLORS.white} size={25} />
          </View>
        </Pressable>
      </View>
    </>
  );
};
const style = StyleSheet.create({
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sortBtn: {
    backgroundColor: COLORS.dark,
    height: 50,
    width: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
export default SearchComponent;
