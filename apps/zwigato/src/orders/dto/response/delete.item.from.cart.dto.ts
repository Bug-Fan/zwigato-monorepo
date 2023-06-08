import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class DeleteItemFromCartResponseDto extends CommonResponseDto {
  constructor(isError, message) {
    super(isError, message);
  }
}
