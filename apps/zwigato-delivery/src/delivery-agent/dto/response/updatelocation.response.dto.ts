import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CommonResDto } from 'src/dto/common_res.dto';

export class updateLocationResponseDto extends CommonResDto {
  constructor(status, msg) {
    super(status, msg);
    this.status = status;
    this.msg = msg;
  }
}
