import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  Max,
  ValidateNested,
} from 'class-validator';

export class AddToCartRequestDto {
  @ApiProperty({ name: 'itemId', description: 'Id of item', example: 1 })
  @IsPositive()
  @IsInt()
  itemId: number;

  @ApiProperty({
    name: 'itemQuantity',
    description: 'Quantity of item',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Max(10)
  itemQuantity: number;

  @ApiProperty({
    name: 'addons',
    description: 'Addons array for the item',
    example: [
      { menuAddonId: 1, addonQuantity: 2 },
      { menuAddonId: 3, addonQuantity: 8 },
    ],
  })
  @IsArray()
  @ValidateNested()
  @Type(() => cartAddons)
  selectedAddons: cartAddons[];
}

export class cartAddons {
  @ApiProperty({ name: 'menuAddonId', description: 'Id of addon', example: 1 })
  @IsInt()
  @IsPositive()
  menuAddonId: number;

  @ApiProperty({
    name: 'addonQuantity',
    description: 'Quantity of addon',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Max(10)
  addonQuantity: number;
}
