import { Order } from 'src/db/entities/order.entity';
import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class OrderHistoryResponseDto extends CommonResponseDto {
  data: OrderHistoryResponseData;

  constructor(isError, message, order: Order[]) {
    super(isError, message);
    this.data = new OrderHistoryResponseData(order);
  }
}

export class OrderHistoryResponseData {
  order: Order[];
  constructor(order: Order[]) {
    this.order = order;
  }
}
