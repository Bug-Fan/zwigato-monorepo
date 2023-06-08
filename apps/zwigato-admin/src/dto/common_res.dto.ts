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
  isError: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'message',
    description: 'message',
    type: 'string',
    required: true,
  })
  msg: string;



  constructor(isError, msg) {
    this.isError = isError;
    this.msg = msg;
  }
}
