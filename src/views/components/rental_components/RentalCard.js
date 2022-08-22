import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../../consts/colors';
const {width} = Dimensions.get('screen');
const RentalCard = ({house}) => {
  return (
    <Pressable
      onPress={() => navigation.navigate('RentalDetailsScreen', house)}>
      <View style={style.card}>
        <Image source={house.pics} style={style.cardImage} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {house.conditionsOfStay}
          </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: COLORS.blue}}>
            UGX 3,000,000
          </Text>
        </View>
        <Text style={{color: COLORS.grey, marginTop: 5, fontSize: 14}}>
          Ntinda
        </Text>
        <View style={{marginTop: 10, flexDirection: 'row'}}>
          <View style={style.facility}>
            <Icon name="hotel" size={18} />
            <Text style={style.facilityText}>2</Text>
          </View>
          <View style={style.facility}>
            <Icon name="bathtub" size={18} />
            <Text style={style.facilityText}>1</Text>
          </View>
          <View style={style.facility}>
            <Icon name="aspect-ratio" size={18} />
            <Text style={style.facilityText}>100</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
const style = StyleSheet.create({
  card: {
    height: 250,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },

  facility: {
    flexDirection: 'row',
    marginRight: 12,
  },
  facilityText: {
    marginLeft: 5,
    color: COLORS.grey,
  },
});
export default RentalCard;
