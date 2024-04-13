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
        padding: '1.5rem',
        marginBottom: '1rem',
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
            gap: '0.3rem',
          }}>
          <Text>BEDS</Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem'}}>
            <Icon type="fa" name="bed" />
            <Text>{rooms}</Text>
          </View>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: 'gray',
            height: '100%',
          }}></View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
          <Text>BATHS</Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem'}}>
            <Icon type="fa" name="bath" />
            <Text>{baths}</Text>
          </View>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: 'gray',
            height: '100%',
          }}></View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
          <Text>PARKING</Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem'}}>
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
