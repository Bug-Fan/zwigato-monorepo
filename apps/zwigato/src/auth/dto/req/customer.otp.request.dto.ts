import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNumberString, Length } from 'class-validator';

export class CustomerOtpRequestDto {
  @ApiProperty({
    name: 'Customer Email',
    description: 'Email id of Customer',
    example: 'prathamthakarani@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    name: 'Otp',
    description: 'Otp for Customer registration',
    example: '123456',
  })
  @IsNumberString()
  @Length(6, 6)
  OTP: string;
}
