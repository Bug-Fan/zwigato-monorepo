import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';

export class AddAddressReqDto {
  @ApiProperty({
    name: 'addressLine1',
    description: 'Address line 1 for customer',
    example: 'A/13 rabari colony',
  })
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiProperty({
    name: 'addressLine2',
    description: 'Address line 2, optional',
    example: '-',
  })
  @IsOptional()
  @IsString()
  addressLine2: string;

  @ApiProperty({
    name: 'pincode',
    description: 'pincode according to your location',
    example: '380026',
  })
  @IsPostalCode('IN')
  pincode: string;

  @ApiProperty({
    name: 'city',
    description: 'City of customer',
    example: 'Ahmedabad',
  })
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    name: 'state',
    description: 'state of Customer',
    example: 'Gujarat',
  })
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    name: 'addressLatitude',
    description: 'Lattitude of Customer',
    example: '23.695',
  })
  @IsLatitude()
  addressLatitude: string;

  @ApiProperty({
    name: 'addressLongitude',
    description: 'Longtitude of Customer',
    example: '96.365',
  })
  @IsLongitude()
  addressLongitude: string;
}
