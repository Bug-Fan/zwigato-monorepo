import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { OrderItems } from 'src/db/entities/orderItems.entity';
import { CommonResDto } from 'src/dto/common_res.dto';

class DataRes {
  @IsOptional()
  @IsObject()
  @ApiProperty({
    name: 'OrderInvoice',
    description: 'OrderInvoice',
    type: 'object',
    required: true,
  })
  orderInvoice: object;

  orderDetails: OrderItem[];

  customer_Details: object;

  constructor(Data: DataRes) {
    const { orderDetails, orderInvoice } = Data;
    this.orderInvoice = orderInvoice;
    this.orderDetails = orderDetails.map((item) => new OrderItem(item));
  }
}

export class DeliverOrderResDto extends CommonResDto {
  data: DataRes;
  constructor(status, msg, data) {
    super(status, msg);
    this.status = status;
    this.msg = msg;
    this.data = new DataRes(data);
    // this.orderInvoice = orderInvoice;
    // this.orderDetails = orderData.map((order) => new OrderItem(order));
  }
}

export class OrderItem {
  orderItem: object;

  constructor(item) {
    this.orderItem = item;
  }
}
