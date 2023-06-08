import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class DeleteParamAddOns {
  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive({ message: 'Only Positive Value Allowed' })
  menuAddOnId: number;
}
