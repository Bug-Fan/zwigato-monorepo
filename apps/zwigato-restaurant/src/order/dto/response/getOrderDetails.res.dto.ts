import { ApiProperty } from "@nestjs/swagger";
import { Order } from "src/database/entities/order.entity";
import { CommonResDto } from "src/dto/commonResponse.dto";

export class GetOrderDetailsRes extends CommonResDto{
  data: OrderDetailsRes[]

  constructor(isError,message,orders: Order[]) {
    super(isError,message);
    this.data = orders.map(item => new OrderDetailsRes(item))
  }
}

export class OrderDetailsRes {
  orderId: string;
  orderStatus: string;
  isrestaurantAccepted: boolean;
  isDeliveryAccepted: boolean;
  orderItems: orderItemsResponse[];
  customerId: string;
  customerName: string;
  customerPhone: string;
  constructor(orderData: Order) {
    const { orderId, orderStatus, isrestaurantAccepted, isDeliveryAccepted } =
      orderData;
    this.orderId = orderId;
    this.orderStatus = orderStatus;
    this.isrestaurantAccepted = isrestaurantAccepted;
    this.isDeliveryAccepted = isDeliveryAccepted;
    this.customerId = orderData.customer.customerId;
    this.customerName = orderData.customer.customerName;
    this.customerPhone = orderData.customer.customerPhone;
    this.orderItems = orderData.orderItems.map(
      (item) => new orderItemsResponse(item),
    );
  }
}

export class customerDataRes {
  customerId: string;
  customerName: string;
  customerPhone: string;

  constructor(customer) {
    const { customerId, customerName, customerPhone } = customer;
    this.customerId = customerId;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
  }
}

export class orderItemsResponse {
  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  orderItemId: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  itemName: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  quantity: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  itemTotalAmount: string;
  orderAddOn: orderAddOnResponse[];
  constructor(orderItem) {
    const { orderItemId, itemName, quantity, itemTotalAmount, orderAddOn } =
      orderItem;
    this.orderItemId = orderItemId;
    this.itemName = itemName;
    this.quantity = quantity;
    this.itemTotalAmount = itemTotalAmount;
    this.orderAddOn = orderAddOn.map((i) => new orderAddOnResponse(i));
  }
}

export class orderAddOnResponse {
  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  orderAddOnId: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  orderAddonName: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  orderAddOnPrice: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  quantity: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  totalAddonPrice: string;
  constructor(addOnItem) {
    const {
      orderAddOnId,
      orderAddonName,
      orderAddOnPrice,
      quantity,
      totalAddonPrice,
    } = addOnItem;
    this.orderAddOnId = orderAddOnId;
    this.orderAddonName = orderAddonName;
    this.orderAddOnPrice = orderAddOnPrice;
    this.quantity = quantity;
    this.totalAddonPrice = totalAddonPrice;
  }
}
