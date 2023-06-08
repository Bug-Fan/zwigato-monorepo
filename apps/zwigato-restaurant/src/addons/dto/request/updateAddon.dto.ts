import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class UpdateAddOns {
  @IsString()
  @IsNotEmpty()
  addonDescription: string;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive({ message: 'Only Positive Value Allowed..' })
  @Max(10000)
  addonPrice: number;
}
