import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import COLORS from '../../consts/colors';
// import houses from '../../consts/houses';
import {Context as PropertyContext} from '../../context/property/PropertyContext';
import RentalCard from '../components/rental_components/RentalCard';
import ListOptions from '../components/rental_components/ListOptions';
import ListCategories from '../components/rental_components/ListCategories';
import Header from '../components/Header';
import SearchComponent from '../components/SearchComponent';

const {width} = Dimensions.get('screen');
const HomeScreen = ({navigation}) => {
  const {
    state: {rentals, error},
    // getAllRentals,
  } = useContext(PropertyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    // await getAllRentals();
  };

  useEffect(() => {
    setIsLoading(true);
    loadData().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, []);
  const refreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={async () => {
          setIsRefreshing(true);
          await loadData();
          setIsRefreshing(false);
        }}
        tintColor={COLORS.primary}
        colors={[COLORS.primary]}
      />
    );
  }, []);

  if (isLoading) {
    return (
      <View style={style.centered}>
        {/* <ActivityIndicator size="large" color={COLORS.primary} /> */}
      </View>
    );
  }
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />
      <Header />
      <ScrollView>
        <SearchComponent />
        <View>
          <ListOptions />
        </View>
        <View>
          <ListCategories />
        </View>
        {/* <FlatList
          refreshControl={refreshControl}
          snapToInterval={width - 20}
          contentContainerStyle={{paddingLeft: 20, paddingVertical: 20}}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={rentals}
          renderItem={({item}) => <RentalCard house={item} />}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
});
export default HomeScreen;
