import React from 'react';
import { View, Text } from 'react-native';
import COLORS from '../../consts/colors';

const PropertyCost = ({ price, frequency }) => {
  return (
    <View style={{ backgroundColor: 'white', padding: 1.5, paddingBottom:5, marginBottom: 4 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 0.3}}>
          <Text style={{ fontSize: 12, color: COLORS.gray, fontWeight: 'normal' }}>PRICE</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
            <Text>{price} {frequency}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PropertyCost;
