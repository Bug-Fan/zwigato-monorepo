import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsArray,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class RestaurantSignInDto {
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
  restaurantPassword: string;
}
