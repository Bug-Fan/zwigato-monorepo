import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString } from 'class-validator';

export class VerifyOtoDto {
  @ApiProperty({
    name: 'email',
    description: 'enter email',
    type: 'email',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'OTP',
    description: 'enter OTP received on email',
    type: 'string',
    required: true,
  })
  @IsNumberString()
  OTP: string;
}
