import { Restaurant } from 'src/database/entities/restaurant.entity';
import { CommonResDto } from 'src/dto/commonResponse.dto';
export class RestaurantProfileRes extends CommonResDto {
  data: GetRestaurantDetailsRes;

  constructor(isError, message, data: Restaurant) {
    super(isError, message);
    this.data = new GetRestaurantDetailsRes(data);
  }
}
export class GetRestaurantDetailsRes {
  restaurantId: string;
  restaurantName: string;
  restaurantAddressLine1: string;
  restaurantAddressLine2: string;
  pincode: string;
  city: string;
  state: string;
  restaurantLatitude: string;
  restaurantLongitude: string;
  restaurantEmail: string;
  restaurantPhone: string;
  managerName: string;
  pancard: string;
  gstNumber: string;
  fssai: string;
  logoPath: string;
  bankName: string;
  bankIFSC: string;
  bankAccountNumber: string;
  isActive: boolean;
  isDeleted: boolean;

  constructor(obj) {
    this.restaurantId = obj.restaurantId;
    this.restaurantName = obj.restaurantName;
    this.restaurantAddressLine1 = obj.restaurantAddressLine1;
    this.restaurantAddressLine2 = obj.restaurantAddressLine2;
    this.pincode = obj.pincode;
    this.city = obj.city;
    this.state = obj.state;
    this.restaurantLatitude = obj.restaurantLatitude;
    this.restaurantLongitude = obj.restaurantLongitude;
    this.restaurantEmail = obj.restaurantEmail;
    this.restaurantPhone = obj.restaurantPhone;
    this.managerName = obj.managerName;
    this.pancard = obj.pancard;
    this.gstNumber = obj.gstNumber;
    this.fssai = obj.fssai;
    this.logoPath = obj.logoPath;
    this.bankName = obj.bankName;
    this.bankIFSC = obj.bankIFSC;
    this.bankAccountNumber = obj.bankAccountNumber;
    this.isActive = obj.isActive;
    this.isDeleted = obj.isDeleted;
  }
}
