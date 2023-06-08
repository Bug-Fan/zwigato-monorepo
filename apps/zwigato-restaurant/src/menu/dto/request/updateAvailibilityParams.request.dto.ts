import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdateAvaililibilyParamDTO {
  @Transform(({ value }) => +value)
  @IsNumber()
  itemId: number;
}
