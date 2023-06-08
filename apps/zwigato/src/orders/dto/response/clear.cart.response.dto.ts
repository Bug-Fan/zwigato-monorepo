import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class ClearCartResponseDto extends CommonResponseDto {
  constructor(isError, messaage) {
    super(isError, messaage);
  }
}
