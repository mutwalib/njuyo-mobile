import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '../../consts/Icon';
import {formatDate, formatTime} from '../../helpers/Helpers';
import {useNavigation} from '@react-navigation/native';
import {
  getRentalByExternalId,
} from '../../services/RentalService';
const BookingCard = ({booking}) => {
  const navigation = useNavigation();
  const handleRentalClick = async () => {
    const response = await getRentalByExternalId(booking.rentalExternalId);
    navigation.navigate('rental_details', response.data);
  };
  const handleOnApproveInspection = async () => {};
  const renderCancelBookingButton = booking => {
    const scheduleDateTimeString = `${formatDate(
      booking.scheduleDate,
    )}T${formatTime(booking.scheduleTime)}`;
    const scheduledDateTime = new Date(scheduleDateTimeString);
    if (booking.status === 'CANCELLED') {
      return null;
    } else if (booking.status === 'RENTED') {
      return (
        <View style={styles.center}>
          <Text>You paid initial rental for this property</Text>
        </View>
      );
    } else if (booking.status === 'INSPECTED') {
      return (
        <View style={styles.center}>
          <Text>You already Visited this property</Text>
        </View>
      );
    } else if (booking.status === 'SCHEDULED' && booking.isScheduleElapsed) {
      return (
        <View style={styles.center}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleOnApproveInspection()}>
            <Text style={styles.buttonText}>
              Confirm you visited the property
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (booking.status === 'SCHEDULED' && !booking.isScheduleElapsed) {
      return (
        <View style={[styles.center, {color: 'green'}]}>
          <Text>Booking Scheduled for viewing Pending your visit</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.right}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'red'}]}
            onPress={() => handleOnCancel()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleRentalClick()}>
        <Text style={styles.title}>{booking.rentalTitle}</Text>
        <Text style={styles.address}>
          <Icon type="fa" name="map-marker" />{' '}
          <Text>{booking.rentalLocation}</Text>
          <Text style={styles.text}>
            {` `}Near {booking.nearLocation}
          </Text>
        </Text>
        <Text style={styles.details}>
          Booking Number: {booking.bookingNumber}
        </Text>
        <Text style={styles.utilities}>
          Rental Owner:{' '}
          {booking.rentalOwner.charAt(0).toUpperCase() +
            booking.rentalOwner.slice(1)}
        </Text>
        <Text style={styles.utilities}>
          Rental Number: {booking.rentalExternalId}
        </Text>
        <Text style={styles.date}>
          Booked on: {new Date(booking.bookedOn).toLocaleDateString()}
        </Text>
        <Text>
          Status:{' '}
          {booking.status === 'SCHEDULED' ? (
            <>
              Visit {booking.status} for{' '}
              {booking.scheduleDate && formatDate(booking.scheduleDate)} at{' '}
              {booking.scheduleTime && formatTime(booking.scheduleTime)}
              {booking.ownerPhone && ` call ${booking.ownerPhone}`} to confirm
            </>
          ) : booking.status === 'CANCELLED' ? (
            booking.status.toLowerCase().charAt(0).toUpperCase() +
            booking.status.toLowerCase().slice(1)
          ) : (
            booking.status.toLowerCase()
          )}
        </Text>
      </TouchableOpacity>
      {renderCancelBookingButton(booking)}
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  address: {
    marginBottom: 8,
  },
  details: {
    marginBottom: 4,
  },
  utilities: {
    marginBottom: 4,
  },
  date: {
    color: '#777',
    fontSize: 12,
  },
});
export default BookingCard;
