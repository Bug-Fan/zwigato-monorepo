import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class ApplyCodeResponseDto extends CommonResponseDto {
  data: ApplyCodeResponseData;
  constructor(
    isError: boolean,
    message: string,
    subTotal: number,
    discountedPrice: number,
  ) {
    super(isError, message);
    this.data = new ApplyCodeResponseData(subTotal, discountedPrice);
  }
}

export class ApplyCodeResponseData {
  subTotal: number;
  discountedPrice: number;

  constructor(subTotal: number, discountedPrice) {
    this.subTotal = subTotal;
    this.discountedPrice = discountedPrice;
  }
}
