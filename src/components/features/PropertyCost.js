import React from 'react';
import { View, Text } from 'react-native';

const PropertyCost = ({ price, currency, frequency }) => {
  return (
    <View style={{ backgroundColor: 'white', padding: '1.5rem', marginBottom: '1rem' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
          <Text style={{ fontSize: 'xl', color: 'gray.500', fontWeight: 'light' }}>PRICE</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <Text>{currency} {price} {frequency}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PropertyCost;
