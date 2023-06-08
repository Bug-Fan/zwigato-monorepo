import { Restaurant } from 'src/db/entities/restaurant.entity';
import { CommonResponseDto } from './common.response.format.dto';

export class GetRestaurantResponseDto extends CommonResponseDto {
  data: GetRestaurantResponseData;
  constructor(isError: boolean, message: string, findBySearch: Restaurant[]) {
    super(isError, message);
    this.data = new GetRestaurantResponseData(findBySearch);
  }
}
export class GetRestaurantResponseData {
  restaurants: restaurant[];
  constructor(restaurants?: Restaurant[]) {
    this.restaurants = restaurants.map((item) => new restaurant(item));
  }
}

export class restaurant {
  status: boolean;
  message: string;
  city: string;
  pincode: string;
  restaurantName: string;
  restaurantId: string;
  restaurantMenu: menuItems[];

  constructor(restaurant: Restaurant) {
    const { city, pincode, restaurantMenu, restaurantName, restaurantId } =
      restaurant;
    this.city = city;
    this.pincode = pincode;
    this.restaurantMenu = restaurantMenu.map((item) => new menuItems(item));
    this.restaurantName = restaurantName;
    this.restaurantId = restaurantId;
  }
}

export class menuItems {
  itemId: string;
  itemName: string;
  itemDescription: string;
  MRP: string;
  isAvailable: boolean;
  ratingAVG: number;
  addOns: AddOns[];

  constructor(item) {
    const {
      itemId,
      itemName,
      itemDescription,
      MRP,
      isAvailable,
      addOns,
      ratingAVG,
    } = item;
    this.itemId = itemId;
    this.itemName = itemName;
    this.itemDescription = itemDescription;
    this.MRP = MRP;
    this.isAvailable = isAvailable;
    this.ratingAVG = ratingAVG;
    this.addOns = addOns.map((item) => new AddOns(item));
  }
}

export class AddOns {
  menuAddOnId: string;
  addOnName: string;
  addonDescription: string;
  addonPrice: string;

  constructor(item) {
    const { menuAddOnId, addOnName, addonDescription, addonPrice } = item;
    this.menuAddOnId = menuAddOnId;
    this.addOnName = addOnName;
    this.addonDescription = addonDescription;
    this.addonPrice = addonPrice;
  }
}
