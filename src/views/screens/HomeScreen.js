import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import COLORS from '../../consts/colors';
import houses from '../../consts/houses';
const {width} = Dimensions.get('screen');
const HomeScreen = ({navigation}) => {
  const ListOptions = () => {
    const optionsList = [
      {title: 'Rent property', img: require('../../assets/house1.jpg')},
      {title: 'Buy property', img: require('../../assets/house2.png')},
    ];
    return (
      <View style={style.optionListContainer}>
        {optionsList.map((option, index) => (
          <View style={style.optionCard} key={index}>
            <Image source={option.img} style={style.optionCardImage} />
            <Text style={{marginTop: 5, fontSize: 12}}>{option.title}</Text>
          </View>
        ))}
      </View>
    );
  };
  const ListCategories = () => {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    const categoryList = ['Rentals', 'Hostels', 'Hotels', 'Houses', 'Land'];
    return (
      <View style={style.categoryListContainer}>
        {categoryList.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedCategoryIndex(index)}>
            <Text
              style={[
                style.categoryListText,
                index == selectedCategoryIndex && style.activeCategoryListText,
              ]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };
  const Card = ({house}) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('RentalDetailsScreen', house)}>
        <View style={style.card}>
          <Image source={house.image} style={style.cardImage} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {house.title}
            </Text>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', color: COLORS.blue}}>
              UGX 3,000,000
            </Text>
          </View>
          <Text style={{color: COLORS.grey, marginTop: 5, fontSize: 14}}>
            Ntinda
          </Text>
          <View style={{marginTop: 10, flexDirection: 'row'}}>
            <View style={style.facility}>
              <Icon name="hotel" size={18} />
              <Text style={style.facilityText}>2</Text>
            </View>
            <View style={style.facility}>
              <Icon name="bathtub" size={18} />
              <Text style={style.facilityText}>1</Text>
            </View>
            <View style={style.facility}>
              <Icon name="aspect-ratio" size={18} />
              <Text style={style.facilityText}>100</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />
      <View style={style.header}>
        <View>
          <Text style={{color: COLORS.grey}}>Location</Text>
          <Text style={{color: COLORS.dark, fontSize: 20, fontWeight: 'bold'}}>
            Uganda
          </Text>
        </View>
        <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
          <Image
            source={require('../../assets/profile.png')}
            style={style.profileImg}
          />
        </Pressable>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <View style={style.searchInputContainer}>
            <Icon name="search" size={25} color={COLORS.grey} />
            <TextInput placeholder="Search Village, City or any location" />
          </View>
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <View style={style.sortBtn}>
              <Icon name="tune" color={COLORS.white} size={25} />
            </View>
          </Pressable>
        </View>
        <View>
          <ListOptions />
        </View>
        <View>
          <ListCategories />
        </View>
        <FlatList
          snapToInterval={width - 20}
          contentContainerStyle={{paddingLeft: 20, paddingVertical: 20}}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={houses}
          renderItem={({item}) => <Card house={item} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sortBtn: {
    backgroundColor: COLORS.dark,
    height: 50,
    width: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  optionListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionCard: {
    height: 120,
    width: width / 2 - 30,
    elevation: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 2,
    paddingTop: 10,
    marginRight: 5,
  },
  optionCardImage: {height: 80, borderRadius: 20, width: '100%'},
  categoryListContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  categoryListText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.grey,
    paddingBottom: 5,
  },
  activeCategoryListText: {
    color: COLORS.dark,
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  card: {
    height: 250,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  facility: {
    flexDirection: 'row',
    marginRight: 12,
  },
  facilityText: {
    marginLeft: 5,
    color: COLORS.grey,
  },
});
export default HomeScreen;
