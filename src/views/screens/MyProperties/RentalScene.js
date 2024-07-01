import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getMyRentals, getRentalById} from '../../../services/RentalService';
import {useNavigation} from '@react-navigation/native';
import MyRentalCard from './MyRentalCard';
import {fetchMyRentals} from '../../../store/myRentalsSlice';

const RentalScene = () => {
  const user = useSelector(state => state.user.user);
  const myRentals = useSelector(state => state.myRentals.myRentals);
  const rentalsStatus = useSelector(state => state.myRentals.status);
  const navigation = useNavigation();

  // const [rentals, setRentals] = useState([]);
  const dispatch = useDispatch();
  const handleRentalClick = async rentalId => {
    const response = await getRentalById(rentalId);
    navigation.navigate('rental_details', response.data);
  };
  // useEffect(() => {
  //   const fetchRentals = async () => {
  //     try {
  //       const response = await getMyRentals(user.id);
  //       if (response.status === 200) {
  //         setRentals(response.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching rentals:', error);
  //     }
  //   };
  //   fetchRentals();
  // }, [user]);
  useEffect(() => {
    if (rentalsStatus === 'idle') {
      dispatch(fetchMyRentals(user.id));
    }
  }, [rentalsStatus, dispatch, user.id]);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('add_rental')}>
        <Text style={styles.buttonText}>Add New Rental</Text>
      </TouchableOpacity>
      {myRentals && (
        <FlatList
          data={myRentals}
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
