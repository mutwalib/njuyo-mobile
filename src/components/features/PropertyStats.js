import React from 'react';
import {View, Text} from 'react-native';
import {TbBath, TbBed, TbParking} from 'react-icons/tb';
import Icon from '../../consts/Icon';

const PropertyStats = ({
  rooms,
  baths,
  isParking,
  price,
  frequency,
  currency,
}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 1.5,
        paddingBottom:5,
        marginBottom: 4,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.2,
          }}>
          <Text>BEDS</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 0.3}}>
            <Icon type="fa" name="bed" />
            <Text>{rooms}</Text>
          </View>
        </View>
        <View
          style={{
            borderLeftWidth: 0.5,
            borderLeftColor: 'gray',
            height: '100%',
          }}></View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.2,
          }}>
          <Text>BATHS</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 0.5}}>
            <Icon type="fa" name="bath" />
            <Text>{baths}</Text>
          </View>
        </View>
        <View
          style={{
            borderLeftWidth: 0.5,
            borderLeftColor: 'gray',
            height: '100%',
          }}></View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.3,
          }}>
          <Text>PARKING</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 0.5}}>
            {isParking ? (
              <Icon type="fa5" name="parking" />
            ) : (
              <Text>No Parking</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PropertyStats;
