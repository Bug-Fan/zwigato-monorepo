import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueryForRestoRequestDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsNotEmpty()
  @IsString()
  pincode: string;
}
