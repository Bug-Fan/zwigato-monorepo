import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CustomerLoginRequestDto {
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
}
