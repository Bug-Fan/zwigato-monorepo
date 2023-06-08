import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsPositive,
  IsString,
  IsPostalCode,
  IsPhoneNumber,
} from 'class-validator';

export class RestaurantSignUpDto {
  @ApiProperty({
    name: 'restaurantName',
    description: 'enter restaurantName',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  restaurantName: string;

  @ApiProperty({
    name: 'restaurantTypeId',
    description: 'enter restaurantTypeId',
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +value)
  restaurantTypeId: number;

  @ApiProperty({
    name: 'restaurantAddressLine1',
    description: 'enter restaurantAddress',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  restaurantAddressLine1: string;

  @ApiProperty({
    name: 'restaurantAddressLine2',
    description: 'enter restaurantAddress',
    type: 'string',
  })
  restaurantAddressLine2: string;

  @ApiProperty({
    name: 'pincode',
    description: 'enter pincode',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsPostalCode('IN')
  pincode: string;

  @ApiProperty({
    name: 'city',
    description: 'enter city',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    name: 'state',
    description: 'enter state',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    name: 'restaurantLatitude',
    description: 'enter restaurantLatitude',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsLatitude()
  restaurantLatitude: string;

  @ApiProperty({
    name: 'restaurantLongitude',
    description: 'enter restaurantLongitude',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsLongitude()
  restaurantLongitude: string;

  @ApiProperty({
    name: 'restaurantEmail',
    description: 'enter restaurantEmail',
    type: 'string',
    required: true,
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  restaurantEmail: string;

  @ApiProperty({
    name: 'restaurantPassword',
    description: 'enter restaurantPassword',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  restaurantPassword: string;

  @ApiProperty({
    name: 'restaurantPhone',
    description: 'enter restaurantPhone',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  restaurantPhone: string;

  @ApiProperty({
    name: 'managerName',
    description: 'enter managerName',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  managerName: string;

  @ApiProperty({
    name: 'pancard',
    description: 'enter pancard',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  pancard: string;

  @ApiProperty({
    name: 'gstNumber',
    description: 'enter gstNumber',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  gstNumber: string;

  @ApiProperty({
    name: 'fssai',
    description: 'enter fssai',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  fssai: string;

  @ApiProperty({
    name: 'logoPath',
    description: 'enter logoPath',
    type: 'string',
    required: true,
  })
  logoPath: string;

  @ApiProperty({
    name: 'bankName',
    description: 'enter bankName',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({
    name: 'bankIFSC',
    description: 'enter bankIFSC',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  bankIFSC: string;

  @ApiProperty({
    name: 'bankAccountNumber',
    description: 'enter bankAccountNumber',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  bankAccountNumber: string;

  @ApiProperty({
    name: ' passBookImage',
    description: ' passBookImage',
    type: 'boolean',
    required: true,
  })
  passBookImagePath: string;
}
