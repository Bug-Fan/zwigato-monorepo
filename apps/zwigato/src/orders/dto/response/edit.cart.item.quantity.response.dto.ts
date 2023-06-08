import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class EditCartItemResponseDto extends CommonResponseDto {
  constructor(isError, message) {
    super(isError, message);
  }
}
