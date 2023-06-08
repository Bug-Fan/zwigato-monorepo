import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
export class AcceptOrderReqDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    name: 'is',
    description: 'Active Account ',
    type: 'boolean',
    required: true,
  })
  acceptStatus?: boolean;
}
