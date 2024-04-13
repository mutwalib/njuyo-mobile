import React, {useState, useEffect} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import Icon from '../../consts/Icon';
import {useRentalFormats} from '../../helpers/hooks/useRentalFormats';
import PropertyThumbnailSlider from '../features/PropertyThumbnailSlider';
import PropertyStats from '../features/PropertyStats';
import TextContentBox from '../features/TextContentBox';
import PropertyCost from '../features/PropertyCost';
import PropertyContact from '../features/PropertyContact';
import {whoAmI} from '../../services/AuthService';
import {checkBooked} from '../../services/RentalService';

const RentalDetail = ({rental}) => {
  const [userId, setUserId] = useState();
  const [isBooked, setIsBooked] = useState(false);

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
              setIsBooked(true);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [id]);

  function previousPage() {
    // Implement navigation logic to go back
  }

  return (
    <ScrollView>
      <View style={{backgroundColor: '#f7f8f9', paddingVertical: '3rem'}}>
        <View
          style={{
            marginHorizontal: 'auto',
            maxWidth: '1280px',
            paddingBottom: '2rem',
          }}>
          <Button title="Go Back" onPress={previousPage} />
        </View>
        <View
          style={{
            marginHorizontal: 'auto',
            maxWidth: '1280px',
            paddingHorizontal: '5%',
            paddingBottom: '2rem',
          }}>
          <Text
            style={{fontSize: 24, fontWeight: 'bold', color: 'blue'}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="TbMapPin" size={20} color="black" />
            <Text style={{fontWeight: 'light', color: 'black'}}>
              {addressName} -{' '}
            </Text>
            <Text style={{color: 'green'}}>For Rent</Text>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 'auto',
            maxWidth: '1280px',
            paddingHorizontal: '5%',
          }}>
          <PropertyThumbnailSlider pics={pics} />
          <View>
            <Tag size="md" variant="subtle" colorScheme="red">
              <TagLabel>Added on {formatDate(addedOn)}</TagLabel>
            </Tag>
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
              style={{
                fontWeight: 'light',
                color: 'gray',
                fontSize: 16,
                lineHeight: 24,
              }}
              numberOfLines={4}
              ellipsizeMode="tail">
              {propertyDetails}
            </Text>
          </TextContentBox>
        </View>
      </View>
    </ScrollView>
  );
};

export default RentalDetail;
