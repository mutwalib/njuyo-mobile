import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {SearchBar, Slider} from 'react-native-elements';
import Header from '../../../Navigation/Header';
import RentalCard from '../../../components/rental/RentalCard';
import {getPagedRentals} from '../../../services/RentalService';

const RentalListingScreen = () => {
  const [rentals, setRentals] = useState(null);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchRentals = async () => {
      const results = await getPagedRentals(1, 10);
      if (results !== null) {
        console.log(results, 'rentals');
        if (results.rentalsCount > 0) {
          setRentals(results.rentalsList);
        }
      }
    };
    // Filter properties based on price range and location
    if (rentals) {
      const filtered = rentals.filter(
        property =>
          property.price >= minPrice &&
          property.price <= maxPrice &&
          property.location.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredRentals(filtered);
    }
    fetchRentals();
  }, [minPrice, maxPrice, searchText]);
  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[...Array(4)].map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
        </View>
      ))}
    </View>
  );
  return (
    <View style={styles.container}>
      <Header />
      <SearchBar
        placeholder="Search location..."
        onChangeText={setSearchText}
        value={searchText}
        lightTheme
        containerStyle={styles.searchBar}
      />
      <View style={styles.priceRange}>
        <Text style={styles.priceLabel}>Price Range</Text>
        <Slider
          value={maxPrice}
          onValueChange={value => setMaxPrice(value)}
          minimumValue={0}
          maximumValue={5000000}
          step={10000}
          trackStyle={styles.sliderTrack}
          thumbStyle={styles.sliderThumb}
          thumbTintColor="#007BFF"
        />
        <Text>
          UGX {minPrice} - UGX {maxPrice}
        </Text>
      </View>
      <View style={styles.gridContainer}>
        {rentals ? (
          <FlatList
            data={rentals}
            numColumns={2}
            renderItem={({item}) => <RentalCard rental={item} />}></FlatList>
        ) : (
          renderSkeleton()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  priceRange: {
    marginVertical: 10,
    paddingHorizontal: 6,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sliderTrack: {
    height: 2,
    borderRadius: 1,
    backgroundColor: '#ccc',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007BFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: '49%',
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#ccc',
  },
  skeletonText: {
    height: 20,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
});

export default RentalListingScreen;
