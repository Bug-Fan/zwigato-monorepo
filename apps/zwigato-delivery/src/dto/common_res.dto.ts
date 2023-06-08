import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CommonResDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    name: 'response Status',
    description: 'response Status',
    type: 'boolean',
    required: true,
  })
  status: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'message',
    description: 'message',
    type: 'string',
    required: true,
  })
  msg: string;

  constructor(status, msg) {
    this.status = status;
    this.msg = msg;
  }
}
