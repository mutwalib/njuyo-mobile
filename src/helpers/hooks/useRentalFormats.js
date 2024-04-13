import {formatDistanceToNow} from 'date-fns';

export const useRentalFormats = ({rental}) => {
  const pricePerMonth = rental?.pricePerMonth?.toLocaleString('en-US', {
    style: 'currency',
    currency: rental.currency,
  });
  const title = rental.title;
  const noOfRooms = rental.noOfRooms;
  const noOfToilets = rental.noOfToilets;
  const isParkingAvailable = rental.isParkingAvailable;
  const propertyDetails = rental.propertyDetails;
  const rentFrequency = rental.rentFrequency;
  const addressName = rental.addressName;
  const currency = rental.currency;
  const id = rental.id;
  const agentId = rental.agentId;
  const owner = rental.owner;
  const pics = rental.pics;
  const addedOn = new Date(rental.registeredOn);
  const externalId = rental.externalId;
  const distance = Math.round(rental.distance);
  const distanceToNow =
    addedOn && formatDistanceToNow(addedOn, {addSuffix: true});
  const takenStatus = rental.takenStatus;
  return {
    id,
    noOfRooms,
    isParkingAvailable,
    noOfToilets,
    pics,
    owner,
    title,
    propertyDetails,
    pricePerMonth,
    agentId,
    rentFrequency,
    addressName,
    currency,
    addedOn,
    externalId,
    distance,
    distanceToNow,
    takenStatus,
  };
};
