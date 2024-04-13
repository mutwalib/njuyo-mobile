export class Houses {
  constructor(
    id,
    adminLockStatus,
    bookStatus,
    isApproved,
    longitude,
    latitude,
    ownerId,
    tType,
    villageId,
    currency,
    occupyingDecimals,
    occupyingLength,
    occupyingWidth,
    price,
    saleStatus,
    saleType,
    suitability,
    isElectricity,
    isWater,
    noOfDinning,
    noOfKitchens,
    noOfToilets,
    noOfBedrooms,
    pics,
  ) {
    this.id = id;
    this.adminLockStatus = adminLockStatus;
    this.bookStatus = bookStatus;
    this.isApproved = isApproved;
    this.longitude = longitude;
    this.latitude = latitude;
    this.ownerId = ownerId;
    this.tType = tType;
    this.villageId = villageId;
    this.currency = currency;
    this.occupyingDecimals = occupyingDecimals;
    this.occupyingLength = occupyingLength;
    this.occupyingWidth = occupyingWidth;
    this.price = price;
    this.saleStatus = saleStatus;
    this.saleType = saleType;
    this.suitability = suitability;
    this.isElectricity = isElectricity;
    this.isWater = isWater;
    this.noOfDinning = noOfDinning;
    this.noOfKitchens = noOfKitchens;
    this.noOfToilets = noOfToilets;
    this.noOfBedrooms = noOfBedrooms;
    this.pics = pics;
  }
}
