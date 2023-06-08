import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
  message: string;

  constructor(isError, message) {
    this.isError = isError;
    this.message = message;
  }
}
