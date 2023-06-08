import { IsInt, IsNotEmpty, IsPositive, Max } from 'class-validator';

export class EditCartQuantityRequestDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  itemId: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(10)
  quantity: number;
}
