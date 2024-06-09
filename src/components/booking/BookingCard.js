import React, {useState} from 'react';
import {Text, View, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '../../consts/Icon';
import {formatDate, formatTime} from '../../helpers/Helpers';
import {useNavigation} from '@react-navigation/native';
import {
  customerConfirmInspection,
  getRentalByExternalId,
} from '../../services/RentalService';

const BookingCard = ({booking}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const navigation = useNavigation();

  const handleRentalClick = async () => {
    const response = await getRentalByExternalId(booking.rentalExternalId);
    navigation.navigate('rental_details', response.data);
  };

  const handleOnApproveInspection = async booking => {
    const result = await customerConfirmInspection(booking);
    if (result.status === 200) {
      showDialog('Success', result.data);
    } else {
      showDialog('Error', 'Not Approved: ' + result.response.data);
    }
  };

  const CustomDialog = ({isVisible, title, message, onClose}) => (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>{message}</Text>
          <TouchableOpacity style={styles.dialogButton} onPress={onClose}>
            <Text style={styles.dialogButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const renderCancelBookingButton = booking => {
    if (booking.status === 'CANCELLED') {
      return null;
    } else if (booking.status === 'RENTED') {
      return (
        <View style={styles.center}>
          <Text style={styles.infoText}>
            You committed to this Rental and it's assigned to you
          </Text>
        </View>
      );
    } else if (booking.status === 'INSPECTED') {
      return (
        <View style={styles.center}>
          <Text style={styles.infoText}>You already Visited this property</Text>
        </View>
      );
    } else if (booking.status === 'SCHEDULED' && booking.isScheduleElapsed) {
      return (
        <View style={styles.center}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleOnApproveInspection(booking)}>
            <Text style={styles.buttonText}>
              Confirm you visited the property
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (booking.status === 'SCHEDULED' && !booking.isScheduleElapsed) {
      return (
        <View style={styles.center}>
          <Text style={[styles.infoText, {color: 'green'}]}>
            Booking Scheduled for viewing Pending your visit
          </Text>
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

  const getCardStyle = status => {
    switch (status) {
      case 'CANCELLED':
        return styles.cardCancelled;
      case 'RENTED':
        return styles.cardRented;
      case 'INSPECTED':
        return styles.cardInspected;
      case 'SCHEDULED':
        return styles.cardScheduled;
      case 'RECIEVED':
        return styles.cardReceived;
      default:
        return styles.card;
    }
  };

  return (
    <View style={getCardStyle(booking.status)}>
      <TouchableOpacity onPress={handleRentalClick}>
        <Text style={styles.title}>{booking.rentalTitle}</Text>
        <Text style={styles.address}>
          <Icon type="fa" name="map-marker" />{' '}
          <Text>{booking.rentalLocation}</Text>
          <Text style={styles.text}> Near {booking.nearLocation}</Text>
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
        <Text style={styles.statusText}>
          Status:{' '}
          {booking.status === 'SCHEDULED' ? (
            <>
              Visit {booking.status} for{' '}
              {booking.scheduleDate && formatDate(booking.scheduleDate)} at{' '}
              {booking.scheduleTime && formatTime(booking.scheduleTime)}
              {booking.ownerPhone && ` call ${booking.ownerPhone}`} to confirm
            </>
          ) : booking.status === 'CANCELLED' ? (
            booking.status.charAt(0).toUpperCase() +
            booking.status.slice(1).toLowerCase()
          ) : (
            booking.status.charAt(0).toUpperCase() +
            booking.status.slice(1).toLowerCase()
          )}
        </Text>
      </TouchableOpacity>
      {renderCancelBookingButton(booking)}
      <CustomDialog
        isVisible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onClose={hideDialog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
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
  cardCancelled: {
    backgroundColor: '#ffcccc', // light red
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
  cardReceived: {
    backgroundColor: '#D8BFD8', // light purple
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
  cardRented: {
    backgroundColor: '#ccffcc', // light green
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
  cardInspected: {
    backgroundColor: '#ccccff', // light blue
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
  cardScheduled: {
    backgroundColor: '#ffffcc', // light yellow
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
    fontSize: 16,
    color: '#555',
  },
  details: {
    marginBottom: 4,
    fontSize: 14,
    color: '#333',
  },
  utilities: {
    marginBottom: 4,
    fontSize: 14,
    color: '#333',
  },
  date: {
    color: '#777',
    fontSize: 12,
  },
  statusText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  right: {
    alignItems: 'flex-end',
  },
  center: {
    alignItems: 'center',
    marginTop: 10,
  },
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dialogMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  dialogButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  dialogButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BookingCard;
