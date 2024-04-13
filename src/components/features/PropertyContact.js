import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert} from 'react-native';
// import {useSelector, useDispatch} from 'react-redux';
import {
  bookRental,
  deleteRental,
  checkBooked,
  cancelBooking,
  getBooking,
} from '../../services/RentalService';
// import {selectUser} from '../../../../store/userSlice';
import {useNavigation} from '@react-navigation/native';

const PropertyContact = ({owner, agentId, rentalId}) => {
  const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(false);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const [isEditButtonDisabled, setIsEditButtonDisabled] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isNotCancellable, setIsNotCancellable] = useState(false);

  const navigation = useNavigation();
  // const userId = useSelector(state => state.user.user)?.id;

  useEffect(() => {
    // checkBookingStatus();
  }, []);

  // const checkBookingStatus = async () => {
  //   try {
  //     if (userId !== null && userId !== undefined) {
  //       const data = {uId: userId, rId: rentalId};
  //       const resp = await checkBooked(data);
  //       if (resp?.data === true) {
  //         setIsBooked(true);
  //         const result = await getBooking(data);
  //         const book = result.data;
  //         if (book.isRented || book.isInspected || book.isScheduled) {
  //           setIsNotCancellable(true);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleOnCancel = () => {
    setShowDialog(true);
  };

  const handleCloseModal = () => {
    setShowDialog(false);
  };

  // const handleCancelConfirm = async () => {
  //   try {
  //     if (userId !== null && userId !== undefined) {
  //       const data = {rentalId: rentalId, customerId: userId};
  //       const response = await cancelBooking(data);
  //       if (response?.status === 202) {
  //         setIsBooked(false);
  //         Alert.alert(
  //           'Cancelled',
  //           'Booking for this property ' + response.data,
  //           [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  //           {cancelable: false},
  //         );
  //         setIsBookButtonDisabled(!isBookButtonDisabled);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleOnBooking = async () => {
  //   setIsBookButtonDisabled(true);
  //   try {
  //     if (userId === null) {
  //       Alert.alert(
  //         'You are not logged in.',
  //         'Please sign in to book this property!',
  //         [
  //           {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
  //           {
  //             text: 'Log In',
  //             onPress: () => navigation.navigate('Login'), // Assuming your login screen is named 'Login'
  //           },
  //         ],
  //         {cancelable: false},
  //       );
  //       return;
  //     }
  //     const response = await bookRental({rentalId, userId});
  //     if (response?.status === 200) {
  //       setIsBooked(true);
  //       Alert.alert(
  //         'Booking Successful',
  //         response.data,
  //         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  //         {cancelable: false},
  //       );
  //     } else {
  //       Alert.alert(
  //         'Booking Failed',
  //         response.data,
  //         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  //         {cancelable: false},
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsBookButtonDisabled(false);
  //   }
  // };

  const handleOnEdit = async () => {
    setIsEditButtonDisabled(true);
    try {
      if (rentalId) {
        navigation.replace(`/editRental/${rentalId}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditButtonDisabled(false);
    }
  };

  const handleOnDelete = async () => {
    setIsDeleteButtonDisabled(true);
    const data = {id: 'rentalId', userId: 'userId'};
    try {
      const response = await deleteRental(data);
      Alert.alert(
        'Booking Successful',
        response.data,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Booking Failed',
        error,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } finally {
      setIsDeleteButtonDisabled(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        marginBottom: '1rem',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem'}}>
            <Text>Owned By: {owner}</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem'}}>
            {/* {useSelector(state => state.user.user)?.id === agentId ? (
              <View style={{flexDirection: 'row', gap: '0.5rem'}}>
                <Button
                  title="Edit Rental"
                  disabled={isEditButtonDisabled}
                  onPress={handleOnEdit}
                />
                <Button
                  title="Delete Rental"
                  disabled={isDeleteButtonDisabled}
                  onPress={handleOnDelete}
                />
              </View>
            ) : isNotCancellable ? null : isBooked ? (
              <Button title="Cancel Booking" onPress={handleOnCancel} />
            ) : ( */}
            <Button
              title="Book Now"
              disabled={isBookButtonDisabled}
              // onPress={handleOnBooking}
            />
            {/* )} */}
          </View>
        </View>
      </View>
      <Dialog
        title={`Cancel Booking`}
        onClose={handleCloseModal}
        onProceed={() => handleCancelConfirm()}
        showDialog={showDialog}
        declineLabel="Decline"
        proceedLabel="Proceed">
        <Text>Are you sure you want to cancel Booking for this property?</Text>
      </Dialog>
    </View>
  );
};

export default PropertyContact;
