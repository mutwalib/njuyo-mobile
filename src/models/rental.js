export class Rental {
  constructor(
    id,
    bookStatus,
    adminLockStatus,
    currency,
    isApproved,
    transactionType,
    latitude,
    longitude,
    ownerId,
    villageId,
    conditionsOfStay,
    pricePerMonth,
    takenStatus,
    initialPayMonth,
    noOfRooms,
    noOfToilets,
    isSelfContained,
    isKitchenIn,
    isParkingAvailable,
    utilitiesToPay,
    pics,
  ) {
    this.id = id;
    this.bookStatus = bookStatus;
    this.adminLockStatus = adminLockStatus;
    this.currency = currency;
    this.isApproved = isApproved;
    this.transactionType = transactionType;
    this.pics = pics;
    this.latitude = latitude;
    this.longitude = longitude;
    this.ownerId = ownerId;
    this.villageId = villageId;
    this.conditionsOfStay = conditionsOfStay;
    this.pricePerMonth = pricePerMonth;
    this.takenStatus = takenStatus;
    this.initialPayMonth = initialPayMonth;
    this.noOfRooms = noOfRooms;
    this.noOfToilets = noOfToilets;
    this.isSelfContained = isSelfContained;
    this.isKitchenIn = isKitchenIn;
    this.isParkingAvailable = isParkingAvailable;
    this.utilitiesToPay = utilitiesToPay;
    this.propertyId = propertyId;
  }
}
