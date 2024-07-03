import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '../../consts/Icon';
import {formatDate, formatTime} from '../../utils/Helper';
import {
  addTakenRental,
  cancelAppointment,
  getSchedule,
  ownerConfirmInspection,
  receiveBooking as receiveBookingService,
  scheduleAppointment as scheduleAppointmentService,
} from '../../services/RentalService';
import {
  handleReceiveBookingAction,
  handleApproveInspectionAction,
  handleRentOutPropertyAction,
  handleScheduleAppointmentAction,
  handleCancelAppointmentAction,
} from '../../store/myBookingsSlice';
import SelectDropdown from 'react-native-select-dropdown';

const BookingDetailsScreen = ({navigation, route}) => {
  const {selectedBooking, rentalId, user, isRented} = route.params;
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const handleReceiveBooking = async () => {
      const response = await receiveBookingService(selectedBooking.bookId);
      if (response.status === 202) {
        console.log('selectedBooking.bookId', selectedBooking.bookId);
        dispatch(handleReceiveBookingAction(selectedBooking.bookId));
      }
    };
    handleReceiveBooking();
  }, [selectedBooking, dispatch]);

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

  const handleApproveInspection = async booking => {
    const result = await ownerConfirmInspection(booking);
    if (result.status === 200) {
      dispatch(handleApproveInspectionAction(booking));
      showDialog('Info', result.data);
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
      dispatch(handleRentOutPropertyAction(booking));
      showDialog('Success', result.data);
    } else {
      showDialog('Error', result.data);
    }
  };

  const handleScheduleAppointment = async selectedBooking => {
    console.log('selected booking', selectedBooking);
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
    const response = await scheduleAppointmentService(request);
    if (response?.status === 202) {
      dispatch(handleScheduleAppointmentAction(request));
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
        dispatch(handleCancelAppointmentAction(selectedBooking.bookId));
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
          console.log(
            'schedule.bookingScheduled.id',
            schedule.bookingScheduled.id,
          );
          const bookId = schedule.bookingScheduled.id;
          const cancelled = await cancelAppointment(bookId);
          console.log('cancelled', cancelled);
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
        const response = await scheduleAppointmentService(request);
        if (response?.status === 200) {
          dispatch(handleScheduleAppointmentAction(request));
          showDialog(
            'Success',
            response.data + `Rescheduled for ${selectedDate} ${selectedTime}`,
          );
          navigation.goBack();
        } else {
          showDialog('Error', response.data);
        }
      }
    }
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

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon type="fa" name="chevron-left" size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Booking Details</Text>
        {selectedBooking && (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.text}>
              Customer Name: {selectedBooking.bookedByNames}
            </Text>
            <Text style={styles.text}>
              Booking Date: {formatDate(new Date(selectedBooking.bookedOn))}
            </Text>
            <Text style={styles.text}>Status: {selectedBooking.status}</Text>
            {selectedBooking.status === 'SCHEDULED' && (
              <>
                <View style={styles.scheduledContainer}>
                  <Text style={styles.text}>
                    Schedule Date:{' '}
                    {formatDate(new Date(selectedBooking.scheduleDate))}
                  </Text>
                  <Text style={styles.text}>
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
                      onPress={() => handleApproveInspection(selectedBooking)}>
                      <Text style={styles.buttonText}>Approve Inspection</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
            {selectedBooking.status === 'CANCELLED' && (
              <View>
                <Text style={[styles.text, {color: 'red'}]}>
                  Booking was Cancelled
                </Text>
              </View>
            )}
            {isScheduling && (
              <View>
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Select Date"
                    value={
                      selectedDate ? selectedDate.toLocaleDateString() : ''
                    }
                    editable={false}
                  />
                </TouchableOpacity>
                {selectedDate && (
                  <Text style={styles.text}>
                    Selected Date:{' '}
                    {selectedDate ? selectedDate.toLocaleDateString() : ''}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={showTimePicker}
                  style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Select Time"
                    value={
                      selectedTime ? selectedTime.toLocaleTimeString() : ''
                    }
                    editable={false}
                  />
                </TouchableOpacity>
                {selectedTime && (
                  <Text style={styles.text}>
                    Selected Time:{' '}
                    {selectedTime ? selectedTime.toLocaleTimeString() : ''}
                  </Text>
                )}
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
            {(selectedBooking.status === 'BOOKED' ||
              selectedBooking.status === 'RECIEVED') &&
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
              )}
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
                      {marginLeft: 5, backgroundColor: 'blue'},
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
                    onPress={() => handleScheduleAppointment(selectedBooking)}>
                    <Text style={styles.buttonText}>Schedule Appointment</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {selectedBooking.status === 'INSPECTED' ? (
              selectedBooking.isOwnerApproval ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleRentOutProperty(selectedBooking)}>
                  <Text style={styles.buttonText}>Rent Out Property</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleApproveInspection(selectedBooking)}>
                  <Text style={styles.buttonText}>Approve Inspection</Text>
                </TouchableOpacity>
              )
            ) : selectedBooking.status === 'RENTED' || isRented ? (
              selectedBooking?.rentedBy === selectedBooking.customerId ? (
                <Text style={styles.text}>Assigned</Text>
              ) : (
                <Text style={styles.text}>Taken</Text>
              )
            ) : (
              <Text>{``}</Text>
            )}
          </ScrollView>
        )}
      </View>
      <CustomDialog
        isVisible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onClose={hideDialog}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  input: {
    borderBottomWidth: 0,
    padding: 4,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 14,
  },
  dialogBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
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
    textAlign: 'center',
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
    borderRadius: 10,
  },
  dialogButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingVertical: 10,
  },
  scheduledContainer: {
    marginVertical: 10,
  },
};

export default BookingDetailsScreen;
