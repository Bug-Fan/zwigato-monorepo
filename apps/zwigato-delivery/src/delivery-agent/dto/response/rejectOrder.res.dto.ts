import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { CommonResDto } from 'src/dto/common_res.dto';

export class RejectOrderResDto extends CommonResDto {
  constructor(status, msg) {
    super(status, msg);
    this.status = status;
    this.msg = msg;
  }
}
