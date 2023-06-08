import { CommonResDto } from 'src/dto/common_res.dto';

export class UpdateProfileResDto extends CommonResDto {
  constructor(status, msg) {
    super(status, msg);
    this.status = status;
    this.msg = msg;
  }
}
