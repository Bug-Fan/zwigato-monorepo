import { IsAlphanumeric, IsNotEmpty, IsNumber } from 'class-validator';

export class ApplyCodeRequestDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  couponCode: string;
}
