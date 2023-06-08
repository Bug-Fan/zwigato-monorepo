import { ParseBoolPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { JobType, TshirtSize } from 'src/db/entities/deliveryAgent.entity';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'enter your name ',
    example: 'partham',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  agentName: string;

  @ApiProperty({
    description: 'enter your registered email',
    example: 'admin@gmail.com',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  agentEmail: string;

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
  agentPassword: string;

  @ApiProperty({
    description: 'upload your profile photo',
    example: 'photo.jpg||.png',
    type: 'string',
    required: true,
  })
  agentProfilePath: string;

  @ApiProperty({
    description: 'add your address',
    example: 'addressline 1',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  agentAddressLine1: string;

  @ApiProperty({
    description: 'add your address',
    example: 'addressline 2',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  agentAddressLine2: string;

  @ApiProperty({
    description: 'pincode of your area',
    example: '380012',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pincode: string;

  @ApiProperty({
    description: 'enter city name',
    example: 'ahmedabad',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'enter your state name',
    example: 'gujarat',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'latitude of area',
    example: 'xx.xxxx',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  agentLatitude: string;

  @ApiProperty({
    description: 'longtitude of area',
    example: 'yy.yyyy',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  agentLongitude: string;

  @ApiProperty({
    description: 'agent phone number',
    example: '1234567890',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  agentPhone: string;

  @ApiProperty({
    description: 'upload adhar image',
    example: 'adhar.jpg||.png',
    type: 'string',
    required: true,
  })
  adharcardImagePath: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    name: 'deposited amount true or false',
    description: 'deposited amount true or false ',
    type: 'boolean',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isDeposited: boolean;

  @ApiProperty({
    description: 'upload license',
    example: 'license.jpg||.png',
    type: 'string',
    required: true,
  })
  licenceImagePath: string;

  @ApiProperty({
    description: 'adhar card number',
    example: 'xxxx yyyy zzzz',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  adharcardNumber: string;

  @ApiProperty({
    description: 'license number add',
    example: 'license.jpg||.png',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  licenceNumber: string;

  @ApiProperty({
    description: 'vehicle number add',
    example: 'GJ01BP6969',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  vehicaleNumber: string;

  @ApiProperty({
    description: 'upload rcbook image',
    example: 'rc.jpg||.png',
    type: 'string',
    required: true,
  })
  agentRCBookImagePath: string;

  @ApiProperty({
    description: 'upload passbook image',
    example: 'passbook.png||.jpg',
    type: 'string',
    required: true,
  })
  passBookImagePath: string;

  @ApiProperty({
    description: 'add your bank name',
    example: 'icici',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty({
    description: 'ifsc code number of bank',
    example: 'BKID010001',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  bankIFSC: string;

  @ApiProperty({
    description: 'bank account number',
    example: '123323332323',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  bankAccountNumber: string;

  @ApiProperty({
    description: 'add your tshirt size',
    example: 'M',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TshirtSize)
  tshirtSize: TshirtSize;

  @ApiProperty({
    description: 'add your tshirt size',
    example: 'M',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({
    description: 'registered time',
    example: 'date',
    type: 'string',
    required: true,
  })
  registerdAt: Date;
}
