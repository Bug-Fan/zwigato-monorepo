import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class AddAddonDto {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  menuItemId: number;

  @IsString()
  @IsNotEmpty()
  addOnName: string;

  @IsString()
  @IsNotEmpty()
  addonDescription: string;

  @IsNumber()
  @Transform(({ value }) => +value)
  @Max(10000)
  @IsPositive({ message: 'Only Positive Value Is Allowed...' })
  addonPrice: number;
}
