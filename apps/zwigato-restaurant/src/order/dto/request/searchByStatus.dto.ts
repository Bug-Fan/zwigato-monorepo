import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/database/entities/order.entity';
export class FilterByStatus {
  @ApiProperty({
    name: 'orderStatus',
    description: 'enter orderStatus',
    type: 'orderStatus',
    example: 'PENDING etc',
    required: true,
  })
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
