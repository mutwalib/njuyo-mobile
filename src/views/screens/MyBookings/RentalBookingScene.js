import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import BookingCard from '../../../components/booking/BookingCard';
import { fetchBookings } from '../../../store/myBookingsSlice';
const RentalBookingScene = () => {
  const user = useSelector(state => state.user.user);
  const bookings = useSelector(state => state.bookings.bookings);
  const bookingsStatus = useSelector(state => state.bookings.status);
  const dispatch = useDispatch();
  useEffect(() => {
    if (bookingsStatus === 'idle') {
      dispatch(fetchBookings(user.id));
    }
  }, [bookingsStatus, dispatch, user.id]);
  const renderBookingCard = ({item}) => (
    <BookingCard booking={item}/>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBookingCard}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginHorizontal: 10,
  },
  flatList: {
    paddingBottom: 16,
  },
  
});

export default RentalBookingScene;
