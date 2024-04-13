export class Land {
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
    this.pics = pics;
  }
}
