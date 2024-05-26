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
  const CustomDialog = ({isVisible, title, message, onClose}) => {
    return (
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
      if (user === null && !isOwner) {
        navigation.navigate('Login');
        return;
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
    setIsModalOpen(true);
    const response = await receiveBooking(booking.bookId);
    if (response.status === 202) {
      if (booking.status.toLowerCase() === 'booked') {
        booking.status = 'RECEIVED';
      }
    }
  };

  const handleViewBookedProperty = async booking => {
    try {
      if (booking && booking.rentalExternalId) {
        navigation.navigate('rental_details', rental);
      } else {
        console.error('Invalid response or data structure');
      }
    } catch (error) {
      console.error('Error fetching rental:', error);
    }
  };

  const handleApproveInspection = async booking => {
    const result = await ownerConfirmInspection(booking);
    if (result.status === 200) {
      showDialog('Success', 'Approved: ' + result.data);

      navigation.goBack();
    } else {
      showDialog('Error', 'Not Approved: ' + result.response.data);
    }
  };

  const handleRentOutProperty = async booking => {
    const result = await addTakenRental({
      customerId: booking.customerId,
      rentalId: booking.rentalId,
    });
    if (result.status === 200) {
      Toast.show({
        type: 'success',
        text1: 'Assigned',
        text2: result.data,
        position: 'top',
        visibilityTime: 5000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Not Assigned',
        text2: result.response.data,
        position: 'top',
        visibilityTime: 5000,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleScheduleAppointment = async selectedBooking => {
    console.log(selectedBooking);
    if (!selectedDate) {
      showDialog('Error', 'Date is Required!');
      return;
    }
    if (!selectedTime) {
      showDialog('Error', 'Appointment Time Error');
      return;
    }
    if (!user?.id) {
      return;
    }
    const request = {
      rentalId: rentalId,
      customerId: selectedBooking.customerId,
      bookingId: selectedBooking.bookId,
      scheduleDate: selectedDate,
      scheduleTime: selectedTime,
      fulfilled: false,
      rescheduleCount: 0,
    };
    const response = await scheduleAppointment(request);
    if (response?.status === 202) {
      showDialog('Success', response.data);
    } else {
      showDialog('Error', response.data);
    }
  };

  const handleCancelSchedule = async selectedBooking => {
    if (selectedBooking.status === 'SCHEDULED') {
      const response = await getSchedule(selectedBooking);
      const schedule = response?.data;
      if (schedule) {
        return cancelAppointment(schedule.bookingScheduled.id);
      }
    }
  };

  const handleRescheduleAppointment = async selectedBooking => {
    if (isScheduling) {
      if (selectedBooking.status === 'SCHEDULED') {
        const result = await getSchedule(selectedBooking);
        const schedule = result?.data;
        if (schedule) {
          cancelAppointment(schedule.bookingScheduled.id);
        }
        if (!selectedDate) {
          showDialog('Error', 'Date is Required!');
          return;
        }
        if (!selectedTime) {
          showDialog('Error', 'Time is Required!');
          return;
        }
        if (!user?.id) {
          showDialog('Error', 'Please sign in to schedule an Appointment!');
          return;
        }
        const request = {
          rentalId: rentalId,
          customerId: selectedBooking.customerId,
          bookingId: selectedBooking.id,
          scheduleDate: selectedDate,
          scheduleTime: selectedTime,
          fulfilled: false,
          rescheduleCount: 1,
        };
        const response = await scheduleAppointment(request);
        if (response?.status === 200) {
          showDialog(
            'Success',
            response.data + `Rescheduled for ${selectedDate} ${selectedTime}`,
          );
          setIsModalOpen(false);
        } else {
          showDialog('Error', response.data);
        }
      }
    }
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
                    {booking.status}
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
          <Modal
            visible={isModalOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}>
                  <Icon type="fa" name="close" size={18} color="#000" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Booking Details</Text>
                {selectedBooking && (
                  <View>
                    <Text>Customer Name: {selectedBooking.bookedByNames}</Text>
                    <Text>
                      Booking Date:{' '}
                      {formatDate(new Date(selectedBooking.bookedOn))}
                    </Text>
                    <Text>Status: {selectedBooking.status}</Text>
                    {selectedBooking.status === 'SCHEDULED' && (
                      <>
                        <View>
                          <Text>
                            Schedule Date:{' '}
                            {formatDate(new Date(selectedBooking.scheduleDate))}
                          </Text>
                          <Text>
                            Schedule Time:{' '}
                            {formatTime(new Date(selectedBooking.scheduleTime))}
                          </Text>
                        </View>
                        {!isScheduling && (
                          <>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() =>
                                setIsScheduling(isScheduling => !isScheduling)
                              }>
                              <Text style={styles.buttonText}>Reschedule?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() =>
                                handleApproveInspection(selectedBooking)
                              }>
                              <Text style={styles.buttonText}>
                                Approve Inspection
                              </Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </>
                    )}
                    {selectedBooking.status === 'CANCELLED' && (
                      <View>
                        <Text style={{color: 'red'}}>
                          Booking was Cancelled
                        </Text>
                      </View>
                    )}

                    {isScheduling && (
                      <View>
                        {selectedDate && (
                          <Text style={styles.text}>
                            Selected Date: {selectedDate.toLocaleDateString()}
                          </Text>
                        )}
                        {selectedTime && (
                          <Text style={styles.text}>
                            Selected Time: {selectedTime.toLocaleTimeString()}
                          </Text>
                        )}
                        <TouchableOpacity
                          onPress={showDatePicker}
                          style={styles.inputContainer}>
                          <TextInput
                            style={styles.input}
                            placeholder="Select Date"
                            value={
                              selectedDate
                                ? selectedDate.toLocaleDateString()
                                : ''
                            }
                            editable={false}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={showTimePicker}
                          style={styles.inputContainer}>
                          <TextInput
                            style={styles.input}
                            placeholder="Select Time"
                            value={
                              selectedTime
                                ? selectedTime.toLocaleTimeString()
                                : ''
                            }
                            editable={false}
                          />
                        </TouchableOpacity>
                        {isDatePickerVisible && (
                          <DateTimePicker
                            value={selectedDate || new Date()}
                            mode="date"
                            minimumDate={new Date()}
                            display="default"
                            onChange={handleDateChange}
                          />
                        )}

                        {isTimePickerVisible && (
                          <DateTimePicker
                            value={selectedTime || new Date()}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                          />
                        )}
                      </View>
                    )}
                    {selectedBooking.status === 'BOOKED' ||
                      (selectedBooking.status === 'RECIEVED' &&
                        !isScheduling && (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                              setIsScheduling(isScheduling => !isScheduling)
                            }>
                            <Text style={styles.buttonText}>
                              {selectedBooking.status === 'SCHEDULED'
                                ? `Reschedule Appointment`
                                : `Schedule Appointment`}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    {isScheduling && (
                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[styles.button, {backgroundColor: 'gray'}]}
                          onPress={() =>
                            setIsScheduling(isScheduling => !isScheduling)
                          }>
                          <Text style={styles.buttonText}>Cancel Schedule</Text>
                        </TouchableOpacity>
                        {selectedBooking.status === 'SCHEDULED' ? (
                          <TouchableOpacity
                            style={[
                              styles.button,
                              {marginLeft: 2, backgroundColor: 'blue'},
                            ]}
                            onPress={() =>
                              handleRescheduleAppointment(selectedBooking)
                            }>
                            <Text style={styles.buttonText}>
                              Reschedule Appointment
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={[
                              styles.button,
                              {marginLeft: 5, backgroundColor: 'green'},
                            ]}
                            onPress={() =>
                              handleScheduleAppointment(selectedBooking)
                            }>
                            <Text style={styles.buttonText}>
                              Schedule Appointment
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    {selectedBooking.status === 'APPROVED' && !isRented && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleRentOutProperty(selectedBooking)}>
                        <Text style={styles.buttonText}>Rent Out Property</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          </Modal>
          <CustomDialog
            isVisible={dialogVisible}
            title={dialogTitle}
            message={dialogMessage}
            onClose={hideDialog}
          />
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
