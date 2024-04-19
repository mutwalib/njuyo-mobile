import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Stamp from '../Stamp';
import {useRentalFormats} from '../../helpers/hooks/useRentalFormats';
import axiosClient, {bURL} from '../../services/api/api';
import CustomButton from '../CustomButton';
import Icon from '../../consts/Icon';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const defaultImage = require('../../assets/house.jpg');

const RentalCard = ({rental}) => {
  const {
    id,
    noOfRooms,
    isParkingAvailable,
    noOfToilets,
    pics,
    title,
    propertyDetails,
    pricePerMonth,
    agentId,
    rentFrequency,
    addressName,
    currency,
    externalId,
    distance,
    distanceToNow,
    takenStatus,
  } = useRentalFormats({rental});

  const [displayImage, setDisplayImage] = useState(defaultImage);
  const [isBooked, setIsBooked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImages = async () => {
      if (pics.length > 0) {
        try {
          console.log(pics  );
          const imageUrls = await Promise.all(
            pics.map(async pic => {
              const response = await axios.get(
                bURL + `/uploads/rentals/${pic.picUrl}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': '4RPJln2MkX0_2UAEmMhN7sAfQkFDCzfpK91hAu3LM5I',
                  },
                },
              );
              return response.data;
            }),
          );
          if (imageUrls.length > 0) {
            setDisplayImage({uri: imageUrls[0]});
          } else {
            setDisplayImage(defaultImage);
          }
        } catch (error) {
          console.error('Error fetching images:', error);
          setDisplayImage(defaultImage);
        }
      } else {
        setDisplayImage(defaultImage);
      }
    };
    fetchImages();
  }, [pics]);

  const handleViewRental = () => {
    navigation.navigate('rental_details', rental);
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
          label={'Book Now'}
          onPress={handleViewRental}
          disabled={takenStatus}
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
