import { RestaurantMenuAddOns } from 'src/database/entities/restaurantMenuAddOns.entity';
import { CommonResDto } from 'src/dto/commonResponse.dto';

export class AddonList extends CommonResDto {
  data: GetAddonDetailsRes[];

  constructor(isError, message, addOn: RestaurantMenuAddOns[]) {
    super(isError, message);
    this.data = addOn.map((item) => new GetAddonDetailsRes(item));
  }
}

export class GetAddonDetailsRes {
  menuAddOnId: number;
  addOnName: string;
  menuItemId: number;
  addonDescription: string;
  addonPrice: number;

  constructor(obj) {
    this.menuAddOnId = obj.menuAddOnId;
    this.addOnName = obj.addOnName;
    this.menuItemId = obj.menuItemId;
    this.addonDescription = obj.addonDescription;
    this.addonPrice = obj.addonPrice;
  }
}
