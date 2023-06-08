import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'enter your name ',
    example: 'partham',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  managerName: string;

  @ApiProperty({
    description: 'enter your registered email',
    example: 'manager@gmail.com',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  managerEmail: string;

  @ApiProperty({
    description: 'enter your password',
    example: 'password',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/((?=.*d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  managerPassword: string;

  @ApiProperty({
    description: 'manager phone number',
    example: '1234567890',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  managerPhone: string;

  @ApiProperty({
    description: 'registered time',
    example: 'date',
    type: 'string',
    required: true,
  })
  registerdAt: Date;
}
