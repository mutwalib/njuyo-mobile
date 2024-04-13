export class Hostels {
  constructor(
    id,
    bookStatus,
    adminLockStatus,
    currency,
    isApproved,
    transactionType,
    pics,
    latitude,
    longitude,
    ownerId,
    villageId,
    isParkingAvailable,
    isSecurityAvailable,
    isSwimmingpoolAvailable,
    isToiletIn,
    residenceType,
    availableSpaces,
    takenSpaces,
    pricePerQuota,
  ) {
    this.id = id;
    this.bookStatus = bookStatus;
    this.adminLockStatus = adminLockStatus;
    this.currency = currency;
    this.isApproved = isApproved;
    this.transactionType = transactionType;
    this.latitude = latitude;
    this.longitude = longitude;
    this.ownerId = ownerId;
    this.villageId = villageId;
    this.isParkingAvailable = isParkingAvailable;
    this.isSecurityAvailable = isSecurityAvailable;
    this.isSwimmingpoolAvailable = isSwimmingpoolAvailable;
    this.isToiletIn = isToiletIn;
    this.residenceType = residenceType;
    this.availableSpaces = availableSpaces;
    this.takenSpaces = takenSpaces;
    this.pricePerQuota = pricePerQuota;
    this.pics = pics;
    this.propertyId = propertyId;
  }
}
