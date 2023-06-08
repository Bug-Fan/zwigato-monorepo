import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
export class ActiveDeliveryAgentAccountReqDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    name: 'isActive',
    description: 'Active Account ',
    type: 'boolean',
    required: true,
  })
  activeStatus?: boolean;
}
