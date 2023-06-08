import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class LoginResponseDto extends CommonResponseDto {
  data: string;

  constructor(isError: boolean, message: string, token: string) {
    super(isError, message);
    this.data = token;
  }
}
