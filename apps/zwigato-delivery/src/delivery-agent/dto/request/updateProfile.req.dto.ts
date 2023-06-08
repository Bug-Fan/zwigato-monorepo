import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileReqDto {
  //Profile Info
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'addressLine1',
    description: 'addressLine1',
    type: 'string',
    required: true,
  })
  agentAddressLine1?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'addressLine2',
    description: 'addressLine2',
    type: 'string',
    required: true,
  })
  agentAddressLine2?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'pincode',
    description: 'pincode',
    type: 'string',
    required: true,
  })
  pincode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'city',
    description: 'city',
    type: 'string',
    required: true,
  })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'state',
    description: 'state',
    type: 'string',
    required: true,
  })
  state?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'agentLatitude',
    description: 'agentLatitude',
    type: 'string',
    required: true,
  })
  agentLatitude?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'agentLongitude',
    description: 'agentLongitude',
    type: 'string',
    required: true,
  })
  agentLongitude?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'agentPhone',
    description: 'agentPhone',
    type: 'string',
    required: true,
  })
  agentPhone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'agentProfile image Path',
    description: 'agentProfile image path',
    type: 'string',
    required: true,
  })
  agentProfilePath?: string;

  // Vehicle Info
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'vehicle Number',
    description: 'vehicle Number',
    type: 'string',
    required: true,
  })
  vehicleNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'vehicle rc book image path',
    description: 'vehicle rc book image path',
    type: 'string',
    required: true,
  })
  rcBookImagePath?: string;

  //Bank Details
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'bank name',
    description: 'bank name',
    type: 'string',
    required: true,
  })
  bankName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'bank ifsc',
    description: 'bank ifsc',
    type: 'string',
    required: true,
  })
  bankIFSC?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'bank account number',
    description: 'bank account number',
    type: 'string',
    required: true,
  })
  bankAccountNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'bank passbook image path',
    description: 'bank passbook image path',
    type: 'string',
    required: true,
  })
  passBookImagePath?: string;
}
