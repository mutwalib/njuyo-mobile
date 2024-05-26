import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {getMyRentals, getRentalById} from '../../../services/RentalService';
import {useNavigation} from '@react-navigation/native';
import MyRentalCard from './MyRentalCard';

const RentalScene = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const [rentals, setRentals] = useState([]);
  const handleRentalClick = async rentalId => {
    const response = await getRentalById(rentalId);
    navigation.navigate('rental_details', response.data);
  };
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await getMyRentals(user.id);
        if (response.status === 200) {
          setRentals(response.data);
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };
    fetchRentals();
  }, [user]);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('add_rental')}>
        <Text style={styles.buttonText}>Add New Rental</Text>
      </TouchableOpacity>
      {rentals && (
        <FlatList
          data={rentals}
          renderItem={({item}) => (
            <MyRentalCard
              item={item}
              navigation={navigation}
              handleRentalClick={handleRentalClick}
            />
          )}
          contentContainerStyle={styles.flatList}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 16,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatList: {
    paddingBottom: 16,
  },
});
export default RentalScene;
