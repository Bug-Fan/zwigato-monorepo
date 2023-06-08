import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateOrderStatus {
  @ApiProperty({
    name: 'orderStatus',
    description: 'enter orderStatus',
    type: 'orderStatus',
    example: 'true/false',
    required: true,
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  orderStatus: boolean;
}
