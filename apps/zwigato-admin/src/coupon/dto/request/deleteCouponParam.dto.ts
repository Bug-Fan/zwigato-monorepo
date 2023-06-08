import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class DeleteParamCoupon {
  @IsNumber()
  @Transform(({ value }) => +value)
  @IsPositive({ message: 'Only Positive Value Allowed' })
  couponId: number;
}
