import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdateMenuItemParamsDTO {
  @IsNumber()
  @Transform(({ value }) => +value)
  itemId: number;
}
