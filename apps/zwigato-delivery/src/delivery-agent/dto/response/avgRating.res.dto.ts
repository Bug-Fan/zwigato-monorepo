import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CommonResDto } from 'src/dto/common_res.dto';

export class AvgRatingResDto extends CommonResDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    name: 'average Rating',
    description: 'average Rating',
    type: 'string',
    required: true,
  })
  data: number;

  constructor(status, msg, avgRating) {
    super(status, msg);
    this.status = status;
    this.msg = msg;
    this.data = avgRating;
  }
}
