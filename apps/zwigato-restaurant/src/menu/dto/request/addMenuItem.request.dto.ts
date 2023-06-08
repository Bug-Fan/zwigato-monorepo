import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';
import { FoodType } from 'src/database/entities/restaurantMenu.entity';

export class AddMenuItemDto {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  foodCategoryId: number;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsNotEmpty()
  itemDescription: string;

  @IsEnum(FoodType)
  foodType: FoodType;

  @IsNumber()
  @IsPositive()
  @Max(10000)
  @Transform(({ value }) => +value)
  MRP: number;
}
