import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class RegistrationResponseDto extends CommonResponseDto {
  constructor(isError: boolean, message: string) {
    super(isError, message);
  }
}
