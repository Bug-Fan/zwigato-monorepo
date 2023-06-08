import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class OrderRatingRequestDto {
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  remarks: string;
}
