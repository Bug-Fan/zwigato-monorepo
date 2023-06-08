import { Cart } from 'src/db/entities/cart.entity';
import { CartAddons } from 'src/db/entities/cartAddons.entity';
import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class ViewCartResponseDto extends CommonResponseDto {
  data: ViewCartResponse;
  constructor(
    isError: boolean,
    message: string,
    subTotal: number,
    userCart: Cart[],
    discountedPrice?: number | undefined,
  ) {
    super(isError, message);
    this.data = new ViewCartResponse(subTotal, userCart, discountedPrice);
  }
}

export class ViewCartResponse {
  subTotal: number;
  discountedPrice: number;
  couponCodeName: string;
  cartItems: CartItems[];

  constructor(
    subTotal: number,
    userCart: Cart[],
    discountedPrice: number | undefined,
  ) {
    this.subTotal = subTotal;
    this.couponCodeName = userCart[0].coupon?.couponCodeName;
    this.discountedPrice = discountedPrice ? discountedPrice : subTotal;
    this.cartItems = userCart.map((cartItem) => new CartItems(cartItem));
  }
}

export class CartItems {
  cartItemId: number;
  itemId: number;
  itemName: string;
  itemQuantity: number;
  itemPrice: number;
  itemCost: number;
  itemSubtotal: number;
  itemAddons: CartItemAddons[];

  constructor(cartItem: Cart) {
    this.cartItemId = cartItem.cartItemId;
    this.itemName = cartItem.menu.itemName;
    this.itemId = cartItem.menu.itemId;
    this.itemQuantity = cartItem.quantity;
    this.itemPrice = cartItem.menu.MRP;
    this.itemCost = cartItem.quantity * cartItem.menu.MRP;
    this.itemAddons = cartItem.cartAddOns.map(
      (cartAddon) => new CartItemAddons(cartAddon),
    );
    let totalAddonPrice = 0;
    totalAddonPrice = this.itemAddons.reduce(
      (accumulator, currentValue) => accumulator + currentValue.addonCost,
      totalAddonPrice,
    );
    this.itemSubtotal = this.itemCost + totalAddonPrice;
  }
}

export class CartItemAddons {
  cartItemAddonId: number;
  addonName: string;
  addonQuantity: number;
  addonPrice: number;
  addonCost: number;

  constructor(cartAddon: CartAddons) {
    this.cartItemAddonId = cartAddon.cartAddonItemId;
    this.addonName = cartAddon.menuAddOn.addOnName;
    this.addonQuantity = cartAddon.quantity;
    this.addonPrice = cartAddon.menuAddOn.addonPrice;
    this.addonCost = cartAddon.quantity * cartAddon.menuAddOn.addonPrice;
  }
}
