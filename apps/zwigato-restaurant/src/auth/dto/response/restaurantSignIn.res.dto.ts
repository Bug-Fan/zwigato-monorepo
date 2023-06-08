import { CommonResDto } from 'src/dto/commonResponse.dto';

export class RestaurantSignInResDto extends CommonResDto {
  token?: string;

  constructor(isError, message, token) {
    super(isError, message);
    this.token = token;
  }
}
