import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class AddToCartResponseDto extends CommonResponseDto {
  constructor(isError, message) {
    super(isError, message);
  }
}
