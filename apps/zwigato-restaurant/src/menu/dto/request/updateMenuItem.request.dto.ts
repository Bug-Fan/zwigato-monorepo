import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class UpdateMenuItemRequestDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  itemDescription;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(10000)
  @Transform(({ value }) => +value)
  MRP;

  itemImagepath: string;
}
