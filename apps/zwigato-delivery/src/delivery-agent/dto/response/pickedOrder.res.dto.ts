import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PickedResDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'message',
    description: 'message',
    type: 'string',
    required: true,
  })
  message: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'customer_Address',
    description: 'customer_Address',
    type: 'string',
    required: true,
  })
  customer_address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'customerLatitude',
    description: 'customerLatitude',
    type: 'string',
    required: true,
  })
  customerLatitude: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'customerLongitude',
    description: 'customerLongitude',
    type: 'string',
    required: true,
  })
  customerLongitude: string;

  constructor(message, customer_address, customerLatitude, customerLongitude) {
    this.message = message;
    this.customer_address = customer_address;
    this.customerLatitude = customerLatitude;
    this.customerLongitude = customerLongitude;
  }
}
