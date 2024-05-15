import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {getMyRentals} from '../../../services/RentalService';
import {useNavigation} from '@react-navigation/native';

const RentalScene = () => {
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const [rentals, setRentals] = useState([]);
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await getMyRentals(user.id);
        if (response.status === 200) {
          setRentals(response.data);
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };
    fetchRentals();
  }, [user]); // Fetch rentals when user changes
  const renderRentalCard = ({item}) => (
    <View style={styles.card}>
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
        Registered on: {new Date(item.registeredOn).toLocaleDateString()}
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('add_rental')}>
        <Text style={styles.addRentalButton}>Add New Rental</Text>
      </TouchableOpacity>
      {/* Render rentals in a table */}
      <FlatList
        data={rentals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRentalCard}
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
  addRentalButton: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10,
  },
  flatList: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  address: {
    marginBottom: 8,
  },
  price: {
    color: 'green',
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
export default RentalScene;
