import { Transform } from "class-transformer";
import {  IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from "class-validator";



export class AddCouponDto {
  @IsString()
  @IsNotEmpty()
  couponCodeName: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(30)
  @Transform(({ value }) => +value)
  discountPercent: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => +value)
  MinOrderValue: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => +value)
  couponCategoryId: number;

  @IsDateString()
  expireDate:Date
}


