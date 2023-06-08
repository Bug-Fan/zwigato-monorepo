import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { CommonResDto } from 'src/dto/common_res.dto';

export class ReachDropLocationResDto extends CommonResDto {
  @IsOptional()
  @IsObject()
  @ApiProperty({
    name: 'mobile number',
    description: 'mobile number',
    type: 'string',
    required: true,
  })
  data: object;

  constructor(status, msg, data) {
    super(status, msg);
    this.status = status;
    this.msg = msg;
    this.data = data;
  }
}
