import React, {useEffect, useState} from 'react';
import {View, Text, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {
  bookRental,
  deleteRental,
  checkBooked,
  cancelBooking,
  getBooking,
} from '../../services/RentalService';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
const PropertyContact = ({owner, agentId, rentalId}) => {
  const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(false);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const [isEditButtonDisabled, setIsEditButtonDisabled] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isUnCancellable, setIsUnCancellable] = useState(false);
  const navigation = useNavigation();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    checkBookingStatus();
  }, []);

  const checkBookingStatus = async () => {
    try {
      if (user) {
        const data = {uId: user.id, rId: rentalId};
        const resp = await checkBooked(data);
        if (resp?.data) {
          setIsBooked(true);
          const result = await getBooking(data);
          const book = result.data;
          if (book.isRented || book.isInspected || book.isScheduled) {
            setIsUnCancellable(true);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'You are about to cancel booking for this property.',
      [
        {text: 'Wait', style: 'cancel'},
        {
          text: 'Proceed',
          onPress: handleCancelConfirm,
        },
      ],
      {cancelable: false},
    );
  };

  const handleCancelConfirm = async () => {
    try {
      if (user) {
        const data = {rentalId: rentalId, customerId: user.id};
        const response = await cancelBooking(data);
        if (response?.status === 202) {
          setIsBooked(false);
          Alert.alert(
            'Cancelled',
            'Booking for this property ' + response.data,
            [{text: 'OK'}],
            {
              cancelable: false,
            },
          );
          setIsBookButtonDisabled(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnBooking = async () => {
    setIsBookButtonDisabled(true);
    try {
      if (!user) {
        Alert.alert(
          'You are not logged in.',
          'Please sign in to book this property!',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Log In',
              onPress: () => navigation.navigate('Login'),
            },
          ],
          {cancelable: false},
        );
        return;
      }
      const response = await bookRental({rentalId, userId: user.id});
      if (response?.status === 200) {
        setIsBooked(true);
        Alert.alert('Booking Successful', response.data, [{text: 'OK'}], {
          cancelable: false,
        });
      } else {
        Alert.alert('Booking Failed', response.data, [{text: 'OK'}], {
          cancelable: false,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsBookButtonDisabled(false);
    }
  };

  const handleOnEdit = async () => {
    setIsEditButtonDisabled(true);
    try {
      if (rentalId) {
        navigation.navigate('edit_rental', {rentalId});
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditButtonDisabled(false);
    }
  };
  const handleOnDelete = async () => {
    setIsDeleteButtonDisabled(true);
    const data = {id: rentalId, userId: user.id};
    try {
      const response = await deleteRental(data);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteButtonDisabled(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          {user?.id !== agentId && (
            <View style={styles.ownerContainer}>
              <Text>Owned By: {owner}</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            {user?.id === agentId ? (
              <View style={styles.agentButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  disabled={isEditButtonDisabled}
                  onPress={handleOnEdit}>
                  <Text style={styles.buttonText}>Edit Rental</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  disabled={isDeleteButtonDisabled}
                  onPress={handleOnDelete}>
                  <Text style={styles.buttonText}>Delete Rental</Text>
                </TouchableOpacity>
              </View>
            ) : isUnCancellable ? null : isBooked ? (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleOnCancel}>
                <Text style={styles.buttonText}>Cancel Booking</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.bookButton]}
                disabled={isBookButtonDisabled}
                onPress={handleOnBooking}>
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    paddingBottom: 20,
    marginBottom: 20,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentButtons: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  bookButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
});
export default PropertyContact;
