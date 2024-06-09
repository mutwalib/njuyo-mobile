import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {getMyBookings} from '../../../services/RentalService';
import BookingCard from '../../../components/booking/BookingCard';
const RentalBookingScene = () => {
  const user = useSelector(state => state.user.user);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getMyBookings(user.id);
        console.log('bookings', response?.data);
        if (response.status === 200) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };
    fetchBookings();
  }, [user]);

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
