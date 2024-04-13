export class Property {
  constructor(
    id,
    bookStatus,
    adminLockStatus,
    currency,
    isApproved,
    transactionType,
    rental,
    sale,
    residence,
    pics,
    latitude,
    longitude,
    ownerId,
    villageId,
  ) {
    this.id = id;
    this.bookStatus = bookStatus;
    this.adminLockStatus = adminLockStatus;
    this.currency = currency;
    this.isApproved = isApproved;
    this.transactionType = transactionType;
    this.rental = rental;
    this.sale = sale;
    this.residence = residence;
    this.pics = pics;
    this.latitude = latitude;
    this.longitude = longitude;
    this.ownerId = ownerId;
    this.villageId = villageId;
  }
}
