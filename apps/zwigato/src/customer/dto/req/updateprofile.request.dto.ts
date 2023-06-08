import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileReqDto {
  @ApiProperty({
    name: 'customerName',
    description: 'Name of Customer',
    example: 'Pratham Thakarani',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  customerName: string;

  @ApiProperty({
    name: 'customerPhone',
    description: 'Mobile Number of Customer',
    example: '+919328385217',
  })
  @IsOptional()
  @IsPhoneNumber('IN')
  customerPhone: string;
}
