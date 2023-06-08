import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class VerifyStatusReqDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    name: 'status',
    description: 'status',
    type: 'boolean',
    required: true,
  })
  isVerified: boolean;
}
