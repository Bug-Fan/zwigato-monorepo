import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteMenuItemRequestDTO {
  @IsNumber()
  @Transform(({ value }) => +value)
  itemId: number;
}
