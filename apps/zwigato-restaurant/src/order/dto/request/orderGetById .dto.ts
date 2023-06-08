import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrderGetById {
  @ApiProperty({
    name: 'orderId',
    description: 'enter orderId',
    type: 'string',
    example: '31484ca4-a21b-4ab0-b2f8-a0a0c4c5415f',
    required: true,
  })
  @IsString()
  orderId: string;
}
