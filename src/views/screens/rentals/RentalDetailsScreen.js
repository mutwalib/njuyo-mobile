import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {useRentalFormats} from '../../../helpers/hooks/useRentalFormats';
import PropertyThumbnailSlider from '../../../components/features/PropertyThumbnailSlider';
import PropertyCost from '../../../components/features/PropertyCost';
import PropertyContact from '../../../components/features/PropertyContact';
import PropertyStats from '../../../components/features/PropertyStats';
import TextContentBox from '../../../components/features/TextContentBox';
import {whoAmI} from '../../../services/AuthServices';
import {checkBooked} from '../../../services/RentalService';
// import {useNavigation} from '@react-navigation/native';
import Icon from '../../../consts/Icon';

const RentalDetailsScreen = ({navigation, route}) => {
  const rental = route.params;
  const [userId, setUserId] = useState();
  // const navigation = useNavigation();
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
  }, [id]);

  const previousPage = () => {
    navigation.goBack();
  };

  return (
    <View style={{backgroundColor: '#f7f8f9', paddingVertical: '3rem'}}>
      <View
        style={{
          marginHorizontal: 'auto',
          maxWidth: '1280px',
          paddingBottom: '2rem',
        }}>
        <Icon type="fa" name="back" />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '1280px',
          marginHorizontal: 'auto',
        }}>
        <View
          style={{
            flex: 1,
            marginBottom: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: '3xl',
              fontWeight: 'medium',
              color: 'blue.800',
              textAlign: 'center',
            }}>
            {title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '0.5rem',
            }}>
            <Icon type="fa" name="map" />
            <Text
              style={{
                fontWeight: 'light',
                color: 'blue.600',
                marginLeft: '0.5rem',
              }}>
              {addressName} -{' '}
            </Text>
            <Text style={{color: 'green', fontWeight: 'bold'}}>For Rent</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '0.5rem',
            }}>
            <PropertyThumbnailSlider pics={pics} />
          </View>
          <PropertyCost
            price={pricePerMonth}
            currency={currency}
            frequency={rentFrequency}
          />
          <PropertyContact owner={owner} agentId={agentId} rentalId={id} />
          <PropertyStats
            rooms={noOfRooms}
            baths={noOfToilets}
            price={pricePerMonth}
            frequency={rentFrequency}
            currency={currency}
            isParking={isParkingAvailable}
          />
          <TextContentBox title="Description">
            <Text
              fontWeight="light"
              color="gray.600"
              fontSize="1rem"
              noOfLines="4">
              {propertyDetails}
            </Text>
          </TextContentBox>
        </View>
      </View>
    </View>
  );
};

export default RentalDetailsScreen;
