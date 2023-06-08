import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class RestaurantUpdateDto {
  @ApiProperty({
    name: 'restaurantPhone',
    description: 'enter restaurantPhone',
    type: 'string',
    required: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  restaurantPhone: string;

  @ApiProperty({
    name: 'logoPath',
    description: 'enter logoPath',
    type: 'string',
    required: true,
  })
  @IsOptional()
  logoPath: string;
}
