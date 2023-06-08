import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class OrderPlacedResponseDto extends CommonResponseDto {
  data: OrderPlacedResponseData;

  constructor(isError: boolean, message: string, orderId: string) {
    super(isError, message);
    this.data = new OrderPlacedResponseData(orderId);
  }
}

export class OrderPlacedResponseData {
  orderId: string;

  constructor(orderId: string) {
    this.orderId = orderId;
  }
}
