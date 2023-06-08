import { Optional } from '@nestjs/common';
import { IsDateString, IsOptional } from 'class-validator';

export class EarningRequestDTO {
  @Optional()
  @IsDateString()
  start: string = new Date(0).toISOString();

  @Optional()
  @IsDateString()
  end: string = new Date().toISOString();
}
