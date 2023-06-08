import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { CommonResDto } from 'src/dto/common_res.dto';

class DataRes {
  @IsOptional()
  @IsObject()
  @ApiProperty({
    name: 'restaurant_Details',
    description: 'restaurant_Details',
    type: 'object',
    required: true,
  })
  restaurant_Details: object;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    name: 'customer_Details',
    description: 'customer_Details',
    type: 'object',
    required: true,
  })
  customer_Details: object;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    name: 'customer_address',
    description: 'customer_address',
    type: 'object',
    required: true,
  })
  customerAddressDetails: object;

  orderItems: OrderItems[];

  constructor(Data: DataRes) {
    const {
      orderItems,
      customerAddressDetails,
      customer_Details,
      restaurant_Details,
    } = Data;
    this.orderItems = orderItems.map((item) => new OrderItems(item));
    this.restaurant_Details = restaurant_Details;
    this.customer_Details = customer_Details;
    this.customerAddressDetails = customerAddressDetails;
  }
}

export class AcceptOrderResDto extends CommonResDto {
  data: DataRes;

  constructor(status, msg, data) {
    super(status, msg);
    this.status = status;
    this.msg = msg;
    this.data = new DataRes(data);

    // this.orderData = orderData.map((order) => new OrderDetails(order));
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
