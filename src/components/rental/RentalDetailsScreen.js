import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useRentalFormats} from '../../helpers/hooks/useRentalFormats';
import PropertyThumbnailSlider from '../features/PropertyThumbnailSlider';
import PropertyCost from '../features/PropertyCost';
import PropertyContact from '../features/PropertyContact';
import PropertyStats from '../features/PropertyStats';
import TextContentBox from '../features/TextContentBox';
import {whoAmI} from '../../services/AuthServices';
import {checkBooked} from '../../services/RentalService';
import Icon from '../../consts/Icon';
import COLORS from '../../consts/colors';
import BackButton from '../BackButton';
const RentalDetailsScreen = ({navigation, route}) => {
  const rental = route.params;
  const [userId, setUserId] = useState();
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
    owner,
    addedOn,
    externalId,
    distanceToNow,
  } = useRentalFormats({rental});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await whoAmI();
        console.log(result);
        if (result !== null) {
          const copyData = {...result};
          setUserId(copyData.id);
          if (copyData && copyData.id) {
            let uId = copyData.id;
            let rId = id;
            const data = {uId, rId};
            const resp = await checkBooked(data);
            if (resp.data === true) {
              // Handle booking status
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [id, rental]);
  
  const previousPage = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={{marginBottom: 5}}>
        <BackButton goBack={previousPage} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.infoContainer}>
          <Icon type="fa" name="map" />
          <Text style={styles.address}>{addressName} - </Text>
          <Text style={styles.statusText}>For Rent</Text>
        </View>
        <View style={styles.sliderContainer}>
          <PropertyThumbnailSlider pics={pics} />
        </View>
        <View>
          <PropertyCost price={pricePerMonth} frequency={rentFrequency} />
          <PropertyContact owner={owner} agentId={agentId} rentalId={id} />
          <PropertyStats
            rooms={noOfRooms}
            baths={noOfToilets}
            price={pricePerMonth}
            frequency={rentFrequency}
            currency={currency}
            isParking={isParkingAvailable}
          />
          <TextContentBox title="DESCRIPTION">
            <Text style={styles.description}>{propertyDetails}</Text>
          </TextContentBox>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8f9',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 34,
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  address: {
    fontWeight: 'normal',
    color: COLORS.blue,
    fontSize: 12,
    marginLeft: 5,
  },
  statusText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: 'bold',
  },
  sliderContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 1.5,
    paddingBottom: 5,
    marginBottom: 30,
  },
  description: {
    fontWeight: 'normal',
    color: COLORS.black,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default RentalDetailsScreen;
