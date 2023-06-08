import { RestaurantMenu } from 'src/database/entities/restaurantMenu.entity';
import { RestaurantMenuAddOns } from 'src/database/entities/restaurantMenuAddOns.entity';
import { CommonResDto } from 'src/dto/commonResponse.dto';
import { DeepPartial } from 'typeorm';

export class GetMenuItemsResponse extends CommonResDto {
  data: MenuItemDTO[];

  constructor(isError, message, menuItems: DeepPartial<RestaurantMenu>[]) {
    super(isError, message);
    this.data = menuItems.map((item) => new MenuItemDTO(item));
  }
}

export class MenuItemDTO {
  itemId: number;
  itemName: string;
  itemDescription: string;
  MRP: number;
  itemImagePath: string;
  foodType: string;
  isAvailable: boolean;
  foodCategory: string;
  ratingAVG: number;
  addons: AddOnDTO[];

  constructor(menuitem: DeepPartial<RestaurantMenu>) {
    this.itemId = menuitem.itemId;
    this.itemName = menuitem.itemName;
    this.itemDescription = menuitem.itemDescription;
    this.MRP = +menuitem.MRP;
    this.itemImagePath = menuitem.itemImagePath;
    this.foodType = menuitem.foodType;
    this.isAvailable = menuitem.isAvailable;
    this.foodCategory = menuitem.foodCategory.categoryName;
    this.ratingAVG = menuitem.ratingAVG;
    this.addons = menuitem.addOns.map((item) => new AddOnDTO(item));
  }
}

export class AddOnDTO {
  menuAddOnId: number;
  addOnName: string;
  menuItemId: number;
  addonDescription: string;
  addonPrice: number;
  isAvailable: boolean;
  constructor(addon: RestaurantMenuAddOns) {
    this.menuAddOnId = addon.menuAddOnId;
    this.addOnName = addon.addOnName;
    this.menuItemId = addon.menuItemId;
    this.addonDescription = addon.addonDescription;
    this.addonPrice = +addon.addonPrice;
    this.isAvailable = addon.isAvailable;
  }
}
