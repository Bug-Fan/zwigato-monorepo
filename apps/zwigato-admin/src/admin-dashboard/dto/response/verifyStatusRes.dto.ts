import { ApiProperty } from '@nestjs/swagger';
import { CommonResDto } from 'src/dto/common_res.dto';

export class VerifyStatusResDto extends CommonResDto {
  constructor(isError, msg) {
    super(isError, msg);
  }
}
