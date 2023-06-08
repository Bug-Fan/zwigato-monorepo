import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateAddonParamsDTO {
  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive()
  menuAddOnId: number;
}
