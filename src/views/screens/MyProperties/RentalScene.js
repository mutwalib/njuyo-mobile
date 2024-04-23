import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const RentalScene = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>My Rentals</Text>
      <TouchableOpacity onPress={() => console.log('Add Rental')}>
        <Text>Add Rental</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RentalScene;
