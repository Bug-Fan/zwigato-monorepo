import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/db/entities/order.entity';
import { CommonResDto } from '../../../dto/common_res.dto';
import { OrderBroadcast } from 'src/db/entities/orderBroadcast.entity';

export class ListOrderResDto extends CommonResDto {
  data: OrderDetails[];

  constructor(status, msg, orderData: OrderBroadcast[]) {
    super(status, msg);
    this.data = orderData.map((item) => new OrderDetails(item));
  }
}

export class OrderDetails {
  orderId: string;
  restaurantName: string;
  restaurantAddressLine1: string;
  restaurantAddressLine2: string;
  pincode: string;
  city: string;
  restaurantLatitude: string;
  restaurantLongitude: string;
  phone: string;
  customerDetails: object;
  orderItems: OrderItems[];

  constructor(orderBroadcast: OrderBroadcast) {
    const { orderId, order } = orderBroadcast;

    this.orderId = orderId;
    this.restaurantName = order.restaurant.restaurantName;
    this.restaurantAddressLine1 = order.restaurant.restaurantAddressLine1;
    this.restaurantAddressLine2 = order.restaurant.restaurantAddressLine2;
    this.pincode = order.restaurant.pincode;
    this.city = order.restaurant.city;
    this.restaurantLatitude = order.restaurant.restaurantLatitude;
    this.restaurantLongitude = order.restaurant.restaurantLongitude;
    this.phone = order.restaurant.restaurantPhone;
    this.customerDetails = {
      customerName: order.customer.customerName,
      deliveryAddress: order.deliveryAddress,
      addressLatitude: order.addressLatitude,
      addressLongitude: order.addressLongitude,
    };
    this.orderItems = order.orderItems.map((item) => new OrderItems(item));
  }
}

export class OrderItems {
  orderAddon: OrderAddOns[];
  itemName: string;
  quantity: number;
  itemPrice: number;
  itemTotalAmount: number;

  constructor(item) {
    const { itemName, quantity, itemPrice, itemTotalAmount, orderAddOn } = item;
    this.orderAddon = orderAddOn.map((i) => new OrderAddOns(i));
    this.itemName = itemName;
    this.quantity = quantity;
    this.itemPrice = itemPrice;
    this.itemTotalAmount = itemTotalAmount;
  }
}

export class OrderAddOns {
  menuAddOnId: string;
  addOnName: string;
  quantity: string;
  addonPrice: string;
  totalAddonPrice: string;

  constructor(item) {
    const {
      orderAddOnId,
      orderAddonName,
      orderAddOnPrice,
      quantity,
      totalAddonPrice,
    } = item;

    this.menuAddOnId = orderAddOnId;
    this.addOnName = orderAddonName;
    this.addonPrice = orderAddOnPrice;
    this.quantity = quantity;
    this.totalAddonPrice = totalAddonPrice;
  }
}
