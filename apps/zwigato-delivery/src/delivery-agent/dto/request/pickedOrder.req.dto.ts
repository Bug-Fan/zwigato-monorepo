import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
export class PickedOrderReqDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    name: 'isActive',
    description: 'Picked Order',
    type: 'boolean',
    required: true,
  })
  pickOrderStatus?: boolean;
}
