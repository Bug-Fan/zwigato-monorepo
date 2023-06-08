import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CustomerRegistrationRequestDto {
  @ApiProperty({
    name: 'customerName',
    description: 'Name of Customer',
    example: 'Pratham Thakarani',
  })
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  customerName: string;

  @ApiProperty({
    name: 'customerEmail',
    description: 'Email id of Customer',
    example: 'prathamthakarani@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    name: 'customerPassword',
    description: 'Password of Customer',
    example: 'Pratham',
  })
  @IsString()
  @MaxLength(20)
  @MinLength(5)
  customerPassword: string;

  @ApiProperty({
    name: 'customerPhone',
    description: 'Mobile Number of Customer',
    example: '+919328385217',
  })
  @IsMobilePhone('en-IN', { strictMode: true })
  customerPhone: string;

  profilePath: string;
}
