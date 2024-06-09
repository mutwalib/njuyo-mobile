import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SearchBar, Slider } from 'react-native-elements';
import Header from '../../../Navigation/Header';
import RentalCard from '../../../components/rental/RentalCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPagedRentals } from '../../../store/pagedRentalsSlice';

const RentalListingScreen = () => {
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const dispatch = useDispatch();
  const { rentalsList, loading, error, currentPage, totalPages } = useSelector(
    state => state.rentals,
  );

  useEffect(() => {
    dispatch(fetchPagedRentals({ page: 0, size: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (rentalsList) {
      const filtered = rentalsList.filter(
        property =>
          property.pricePerMonth >= minPrice &&
          property.pricePerMonth <= maxPrice &&
          property.addressName.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredRentals(filtered);
    }
  }, [rentalsList, minPrice, maxPrice, searchText]);

  const loadMoreRentals = () => {
    if (currentPage < totalPages - 1) {
      dispatch(fetchPagedRentals({ page: currentPage + 1, size: 10 }));
    }
  };

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

  const renderHeader = () => (
    <>
      <SearchBar
        placeholder="Search location..."
        onChangeText={setSearchText}
        value={searchText}
        lightTheme
        containerStyle={styles.searchBar}
      />
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setFilterVisible(!filterVisible)}
      >
        <Text style={styles.filterToggleText}>
          {filterVisible ? 'Hide Filters' : 'Show Filters'}
        </Text>
      </TouchableOpacity>
      {filterVisible && (
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
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <Header />
      {renderHeader()}
      <FlatList
        // ListHeaderComponent={renderHeader}
        data={filteredRentals}
        numColumns={2}
        renderItem={({ item }) => <RentalCard rental={item} />}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          loading ? (
            renderSkeleton()
          ) : (
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
              <Text>No rentals match this search criteria.</Text>
            </View>
          )
        }
        onEndReached={loadMoreRentals}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          currentPage < totalPages - 1 && (
            <View style={styles.loadMoreContainer}>
              <Text style={styles.loadMoreText} onPress={loadMoreRentals}>
                Load More
              </Text>
            </View>
          )
        }
      />
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
  filterToggle: {
    padding: 10,
    alignItems: 'center',
  },
  filterToggleText: {
    color: 'blue',
    fontWeight: 'bold',
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
  loadMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    color: 'blue',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RentalListingScreen;
