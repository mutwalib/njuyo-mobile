import React, {useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useRentalFormats} from '../../helpers/hooks/useRentalFormats';
import PropertyCost from '../../components/features/PropertyCost';
import PropertyContact from '../../components/features/PropertyContact';
import PropertyStats from '../../components/features/PropertyStats';
import TextContentBox from '../../components/features/TextContentBox';
import Icon from '../../consts/Icon';
import COLORS from '../../consts/colors';
import BackHeader from '../../Navigation/BackHeader';
import CarouselComponent from '../../components/features/CarouselComponent';

const RentalDetailsScreen = ({navigation, route}) => {
  const rental = route.params;
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
    owner,
    rentFrequency,
    addressName,
    currency,
    addedOn,
    externalId,
    distanceToNow,
  } = useRentalFormats({rental});
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );
  return (
    <View style={styles.container}>
      <View style={{marginBottom: 0}}>
        <BackHeader navigation={navigation} title={title} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Icon type="fa" name="map" />
          <Text style={styles.address}>{addressName} - </Text>
          <Text style={styles.statusText}>For Rent</Text>
        </View>
        <View style={styles.sliderContainer}>
          <CarouselComponent pics={pics} />
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8f9',
  },
  contentContainer: {
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
    marginBottom: 3,
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
    paddingBottom: 1,
    marginBottom: 3,
  },
  description: {
    fontWeight: 'normal',
    color: COLORS.black,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default RentalDetailsScreen;
