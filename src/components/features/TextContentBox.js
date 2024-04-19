import React from 'react';
import {View, Text} from 'react-native';
import COLORS from '../../consts/colors';

const TextContentBox = ({title, children}) => {
  return (
    <View style={{backgroundColor: 'white', padding: 1.5, marginBottom: 1}}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'normal',
          color: COLORS.gray,
          marginBottom: 0.5,
        }}>
        {title}
      </Text>
      <View
        style={{height: 1, backgroundColor: COLORS.black, marginVertical: 0.7}}
      />
      {children}
    </View>
  );
};

export default TextContentBox;
