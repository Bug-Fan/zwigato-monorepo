import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class OrderRatingResponseDto extends CommonResponseDto {
  constructor(isError: boolean, message: string) {
    super(isError, message);
  }
}
