import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateAvaililibilyBodyDTO {
  @IsBoolean()
  isAvailable: boolean;
}
