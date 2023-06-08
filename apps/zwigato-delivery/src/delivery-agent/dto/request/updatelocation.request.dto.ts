import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';
export class updateLocationRequestDto {
    // @IsOptional()
    // @IsString()
    @IsLatitude()
    @ApiProperty({
      name: 'agentLatitude',
      description: 'agentLatitude',
      required: true,
    })
    agentLatitude: string;
  
    // @IsOptional()
    // @IsString()
    @IsLongitude()
    @ApiProperty({
      name: 'agentLongitude',
      description: 'agentLongitude',
      required: true,
    })
    agentLongitude: string;
}
