import { ApiProperty } from '@nestjs/swagger';
import { RestaurantType } from 'src/db/entities/restaurantType.entity';
import { CommonResDto } from 'src/dto/common_res.dto';

class DataRes {
  restaurantData: RestaurantDetails[];
  count: number;
  constructor(Data: DataRes) {
    const restaurantData = Data[0];
    this.count = Data[1];
    this.restaurantData = restaurantData.map(
      (restaurant) => new RestaurantDetails(restaurant),
    );
  }
}

export class GetRestaurantResponseDto extends CommonResDto {
  data: DataRes;
  constructor(isError, msg, data) {
    super(isError, msg);
    this.data = new DataRes(data);
  }
}

export class RestaurantDetails {
  restaurantId: string;
  restaurantName: string;
  restaurantTypeId: number;
  restaurantAddressLine1: string;
  restaurantAddressLine2: string;
  pincode: string;
  city: string;
  state: string;
  restaurantPhone: string;
  managerName: string;
  pancard: string;
  gstNumber: string;
  fssai: string;
  bankName: string;
  bankIFSC: string;
  bankAccountNumber: string;
  isVerified: boolean;
  restaurantType: RestaurantType;

  constructor(restaurant) {
    const {
      restaurantId,
      restaurantName,
      restaurantAddressLine1,
      restaurantAddressLine2,
      pincode,
      city,
      state,
      restaurantPhone,
      managerName,
      pancard,
      gstNumber,
      fssai,
      bankName,
      bankIFSC,
      bankAccountNumber,
      isVerified,
      restaurantType,
    } = restaurant;
    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;
    this.restaurantAddressLine1 = restaurantAddressLine1;
    this.restaurantAddressLine2 = restaurantAddressLine2;
    this.pincode = pincode;
    this.city = city;
    this.state = state;
    this.restaurantPhone = restaurantPhone;
    this.managerName = managerName;
    this.pancard = pancard;
    this.gstNumber = gstNumber;
    this.fssai = fssai;
    this.bankName = bankName;
    this.bankIFSC = bankIFSC;
    this.bankAccountNumber = bankAccountNumber;
    this.isVerified = isVerified;
    this.restaurantType = restaurantType;
  }
}

// export class CatogaryId {}
