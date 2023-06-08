import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RatingRequestDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsOptional()
  @IsString()
  remarks: string;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
