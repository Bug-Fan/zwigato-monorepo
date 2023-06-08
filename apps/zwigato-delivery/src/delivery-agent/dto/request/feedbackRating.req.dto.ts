import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsPositive, IsString } from 'class-validator';
export class FeedbackRatingReqDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    name: 'Rating',
    description: 'Rating ',
    type: 'number',
    required: true,
  })
  rating: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'Remarks',
    description: 'Remark',
    type: 'string',
    required: true,
  })
  remark: string;
}
