import React, {useEffect, useState, useCallback} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {
  getBookingsOnRental,
  getRentalById,
} from '../../../services/RentalService';
import {useNavigation} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingsOnRental } from '../../../store/bookingsOnRental';

const MyRentalCard = ({item}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.bookingOnRental.rentalBookings[item.id]) || [];
  const bookingsCount = bookings.length;
  useEffect(() => {
    dispatch(fetchBookingsOnRental(item.id));
  }, [dispatch, item.id]);

  const handleRentalClick = async rentalId => {
    const response = await getRentalById(rentalId);
    navigation.navigate('rental_details', response.data);
  };

  const handleShowBookings = () => {
    const rental = item;
    const parameters = {bookings, rental}
    navigation.navigate('rental_bookings', parameters);
  };
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleRentalClick(item.id)}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.address}>{item.addressName}</Text>
        <Text style={styles.price}>
          {item.pricePerMonth.toLocaleString('en-US', {
            style: 'currency',
            currency: item.currency,
          })}{' '}
          - {item.rentFrequency}
        </Text>
        <Text style={styles.details}>
          Rooms: {item.noOfRooms} | Toilets: {item.noOfToilets}
        </Text>
        <Text style={styles.utilities}>Utilities: {item.utilitiesToPay}</Text>
        <Text style={styles.date}>
          Added on: {new Date(item.registeredOn).toLocaleDateString()}
        </Text>
        {bookingsCount > 0 && (
          <TouchableOpacity onPress={handleShowBookings}>
            <View style={styles.bookingContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.bookingsCountCircle}>
                  <Text style={styles.bookingsCountText}>{bookingsCount}</Text>
                </View>
                <Text style={styles.bookingsText}>Showed Interest</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 7,
  },
  address: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 7,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 7,
  },
  details: {
    fontSize: 10,
    color: '#495057',
    marginBottom: 7,
  },
  utilities: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 7,
  },
  date: {
    fontSize: 8,
    color: '#adb5bd',
    marginBottom: 7,
  },
  bookingContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  bookingsCountCircle: {
    width: 24,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bookingsCountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  bookingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007bff',
  },
});

export default MyRentalCard;
