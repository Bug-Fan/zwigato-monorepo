import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class PlaceOrderRequestDto {
  @IsNotEmpty()
  @IsInt()
  addressId: number;
}
