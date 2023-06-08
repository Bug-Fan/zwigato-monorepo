import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, Max } from 'class-validator';
import { OrderStatus } from 'src/database/entities/order.entity';

export class UpdateOrderData {
  @ApiProperty({
    name: 'prepareTime',
    description: 'enter prepareTime in minute as number',
    type: 'string',
    example: '20',
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Max(90)
  prepareTime: number;

  @ApiProperty({
    name: 'orderStatus',
    description: 'enter orderStatus',
    type: 'orderStatus',
    example: 'PENDING etc',
    required: true,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  orderStatus: OrderStatus;
}
