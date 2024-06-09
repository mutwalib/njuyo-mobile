import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Stamp from '../Stamp';
import {useRentalFormats} from '../../helpers/hooks/useRentalFormats';
import CustomButton from '../CustomButton';
import Icon from '../../consts/Icon';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {
  fetchAndCacheImage,
  fetchImageUrl,
  rentalPicUrls,
  rentalPictures,
} from '../../services/PictureService';
import {bookRental, checkBooked} from '../../services/RentalService';
import {getRentalsNearYou} from '../../store/nearestRentalSlice';

const defaultImage = require('../../assets/default_house-img.png');

const RentalCard = ({rental}) => {
  const {
    noOfRooms,
    isParkingAvailable,
    noOfToilets,
    pics,
    title,
    pricePerMonth,
    rentFrequency,
    addressName,
    distance,
    distanceToNow,
    takenStatus,
  } = useRentalFormats({rental});
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const [displayImage, setDisplayImage] = useState(defaultImage);
  const [isBooked, setIsBooked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImages = async () => {
      if (pics.length > 0) {
        const resp = await fetchAndCacheImage(pics[0].picUrl);
        setDisplayImage({uri: resp});
      }
    };
    fetchImages();
    checkBookingStatus();
  }, [pics]);
  const checkBookingStatus = async () => {
    try {
      if (user) {
        const data = {uId: user?.id, rId: rental.id};
        const resp = await checkBooked(data);
        if (resp?.data) {
          setIsBooked(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleViewRental = () => {
    navigation.navigate('rental_details', rental);
  };
  const handleEditRental = () => {
    const rentalId = rental.id;
    if (rentalId) {
      navigation.navigate('edit_rental', {rentalId});
    }
  };
  const handleOnBookRental = async () => {
    setIsBookButtonDisabled(true);
    try {
      if (!user) {
        Alert.alert(
          'You are not logged in.',
          'Please sign in to book this property!',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Log In',
              onPress: () => navigation.navigate('Login'),
            },
          ],
          {cancelable: false},
        );
        return;
      }
      const response = await bookRental({
        rentalId: rental.id,
        userId: user?.id,
      });
      if (response?.status === 200) {
        setIsBooked(true);
        getCurrentLocation();
        Alert.alert('Booking Successful', response.data, [{text: 'OK'}], {
          cancelable: false,
        });
      } else {
        Alert.alert('Booking Failed', response.data, [{text: 'OK'}], {
          cancelable: false,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsBookButtonDisabled(false);
    }
  };
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const googleLocation = `${latitude},${longitude}`;
        console.log(googleLocation, 'location');
        dispatch(getRentalsNearYou(googleLocation));
      },
      error => {
        console.log(error.message);
      },
      {enableHighAccuracy: false, timeout: 40000, maximumAge: 10000},
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.card}>
      <TouchableOpacity onPress={handleViewRental}>
        <Image source={displayImage} style={styles.image} />
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>For rent</Text>
        </View>
        {takenStatus && (
          <View style={styles.stampContainer}>
            <Stamp stampLabel="TAKEN" />
          </View>
        )}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {pricePerMonth} {rentFrequency}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.added}>Added {distanceToNow}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{addressName}</Text>
          <Text style={styles.distance}>~ {distance} km Away</Text>
        </View>
        <View style={styles.iconsContainer}>
          <View style={styles.iconTextContainer}>
            <Icon type="fa" name="bed" />
            <Text style={styles.iconText}>{noOfRooms}</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Icon type="fa" name="bath" />
            <Text style={styles.iconText}>{noOfToilets}</Text>
          </View>
          {isParkingAvailable && (
            <View style={styles.iconTextContainer}>
              <Icon type="fa5" name="parking" />
            </View>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          label={
            user && user.id === rental.agentId
              ? 'Edit'
              : isBooked
              ? 'You Booked This'
              : 'Book Now'
          }
          onPress={
            user && user.id === rental.agentId
              ? handleEditRental
              : isBooked
              ? handleViewRental
              : handleOnBookRental
          }
          disabled={
            user && user.id === rental.agentId
              ? false
              : takenStatus || isBookButtonDisabled
          }
          isMyOwn={user && user.id === rental.agentId}
          isBooked={isBooked}
          isHovered={isHovered}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    maxWidth: 290,
    margin: 3,
    borderRadius: 8,
    padding: 5,
  },
  image: {
    height: 150,
    maxWidth: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  badge: {
    backgroundColor: 'green',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 10,
  },
  stampContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(10, 11, 28, 0.6)',
    padding: 10,
  },
  price: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  added: {
    color: '#FF0000',
    fontSize: 7,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  distance: {
    fontSize: 8,
    color: 'blue',
    marginLeft: 12,
    paddingLeft: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  address: {
    fontSize: 10,
    fontWeight: '300',
    flex: 1,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 6,
  },
  iconText: {
    marginLeft: 4,
  },
});

export default RentalCard;
