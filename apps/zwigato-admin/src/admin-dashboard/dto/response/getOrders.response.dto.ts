import { ApiProperty } from '@nestjs/swagger';
import { CommonResDto } from 'src/dto/common_res.dto';

class DataRes {
  orderData: orderDetails[];

  constructor(Data: DataRes) {
    const { orderData } = Data;
    this.orderData = orderData.map((orders) => new orderDetails(orders));
  }
}
export class getOredersResponseDto extends CommonResDto {
  data: DataRes;
  constructor(isError, msg, data) {
    super(isError, msg);
    this.data = data;
  }
}

export class orderDetails {
  deliveryAddress: string;
  subTotal: number;
  totalAmount: number;
  deliveryCharges: number;
  deliveryAgentProfit: number;
  resaturantProfit: number;
  platformProfit: number;
  deliveredOn: Date;
  orderPlacedOn: Date;
  orderId: string;

  constructor(orders) {
    const {
      deliveryAddress,
      subTotal,
      totalAmount,
      deliveryCharges,
      deliveryAgentProfit,
      resaturantProfit,
      platformProfit,
      deliveredOn,
      orderPlacedOn,
      orderId,
    } = orders;
    this.deliveryAddress = deliveryAddress;
    this.subTotal = subTotal;
    this.totalAmount = totalAmount;
    this.deliveryCharges = deliveryCharges;
    this.deliveryAgentProfit = deliveryAgentProfit;
    this.resaturantProfit = resaturantProfit;
    this.platformProfit = platformProfit;
    this.deliveredOn = deliveredOn;
    this.orderPlacedOn = orderPlacedOn;
    this.orderId = orderId;
  }
}
