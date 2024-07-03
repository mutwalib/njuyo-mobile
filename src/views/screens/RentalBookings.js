import React, {useEffect, useState} from 'react';
import {
  addTakenRental,
  cancelAppointment,
  getBookingsOnRental,
  getRentalById,
  getSchedule,
  ownerConfirmInspection,
  receiveBooking,
  scheduleAppointment,
} from '../../services/RentalService';
import {
  View,
  Text,
  Button,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import {getStatusTextColor, formatDate, formatTime} from '../../utils/Helper';
import {Toast} from 'react-native-toast-message';
import BackHeader from '../../Navigation/BackHeader';
import Icon from '../../consts/Icon';
import navigationStrings from '../../consts/navigationStrings';

const RentalBookings = ({navigation, route}) => {
  const {bookings, rental} = route.params;
  console.log('bookings', bookings);
  const rentalId = rental?.id;
  const user = useSelector(state => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const handleDateChange = (event, date) => {
    setDatePickerVisible(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    setTimePickerVisible(false);
    if (time) {
      setSelectedTime(time);
    }
  };
  useEffect(() => {
    const fetchRental = async () => {
      const response = await getRentalById(rentalId);
      if (response.status === 200) {
        if (response?.data?.takenStatus) {
          setIsRented(true);
        }
      }
    };

    const fetchUser = async () => {
      const isOwner = user?.roles.includes('OWNER');
      if (user === null) {
        navigation.navigate(navigationStrings.SIGNIN);
      } else if (!isOwner) {
        navigation.navigate('profile');
      }
    };
    if (navigation.isFocused()) {
      fetchUser();
      fetchRental();
    }
  }, [rentalId]);
  const handleViewBooking = async booking => {
    setSelectedBooking(booking);
    if (booking.status.toLowerCase() === 'scheduled') {
      const scheduleDate = new Date(booking.scheduleDate);
      const scheduleTime = new Date(booking.scheduleTime);
      setSelectedDate(scheduleDate);
      setSelectedTime(scheduleTime);
    }
    navigation.navigate('BookingDetailsScreen', {
      selectedBooking: booking,
      rentalId,
      user,
      isRented,
    });
  };

  return (
    <>
      <BackHeader
        navigation={navigation}
        title={
          `Bookings on ` + rental.title + ` Located in ` + rental.addressName
        }
      />
      <ScrollView>
        {isRented && (
          <View style={styles.rentedBadge}>
            <Text style={styles.rentedText}>Rented</Text>
          </View>
        )}
        <View style={styles.container}>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <TouchableOpacity
                key={booking.bookId}
                style={styles.bookingItem}
                onPress={() => handleViewBooking(booking)}>
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingDate}>
                    {formatDate(new Date(booking.bookedOn))}
                  </Text>
                  <Text
                    style={[
                      styles.bookingStatus,
                      {color: getStatusTextColor(booking.status.toLowerCase())},
                    ]}>
                    {booking.status === 'RENTED'
                      ? booking.customerId === booking.rentedBy
                        ? 'Assigned'
                        : 'Taken'
                      : booking.status}
                  </Text>
                </View>
                <Text style={styles.bookingCustomer}>
                  {booking.bookedByNames}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No bookings found.</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};
const styles = {
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookingItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingDate: {
    fontSize: 16,
  },
  bookingStatus: {
    fontSize: 16,
  },
  bookingCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rentedBadge: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
  },
  rentedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '80%',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
};
export default RentalBookings;
