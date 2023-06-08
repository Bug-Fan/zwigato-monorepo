import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OtpRequestDto {
  @ApiProperty({
    description: 'enter your registered email ',
    example: 'admin@gmail.com',
  })
  @IsNotEmpty()
  agentEmail: string;

  @ApiProperty({
    description: 'enter your OTP shown in mail ',
    example: 'xxxxx',
  })
  @IsNotEmpty()
  OTP: string;
}
