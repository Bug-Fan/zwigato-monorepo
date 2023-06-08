import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBankDetailsRequest {
  @ApiProperty({
    name: 'bankName',
    description: 'enter bankName',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty({
    name: 'bankIFSC',
    description: 'enter bankIFSC',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  bankIFSC: string;

  @ApiProperty({
    name: 'bankAccountNumber',
    description: 'enter bankAccountNumber',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  bankAccountNumber: string;

  @ApiProperty({
    name: ' passBookImage',
    description: ' passBookImage',
    type: 'boolean',
    required: true,
  })
  passBookImagePath: string;
}
