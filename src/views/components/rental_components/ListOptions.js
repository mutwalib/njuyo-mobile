import React from 'react';
import {StyleSheet, View, Dimensions, Image, Text} from 'react-native';
import COLORS from '../../../consts/colors';
const {width} = Dimensions.get('screen');
const ListOptions = () => {
  const optionsList = [
    {title: 'Rent property', img: require('../../../assets/house1.jpg')},
    {title: 'Buy property', img: require('../../../assets/house2.png')},
  ];
  return (
    <View style={style.optionListContainer}>
      {optionsList.map((option, index) => (
        <View style={style.optionCard} key={index}>
          <Image source={option.img} style={style.optionCardImage} />
          <Text style={{marginTop: 5, fontSize: 12}}>{option.title}</Text>
        </View>
      ))}
    </View>
  );
};
const style = StyleSheet.create({
  optionListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionCard: {
    height: 120,
    width: width / 2 - 30,
    elevation: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 2,
    paddingTop: 10,
    marginRight: 5,
  },
  optionCardImage: {height: 80, borderRadius: 20, width: '100%'},
});
export default ListOptions;
