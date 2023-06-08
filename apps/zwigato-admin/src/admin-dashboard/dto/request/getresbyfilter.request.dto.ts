import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class GetResByFilterRequestDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
      name: 'message',
      description: 'restaurant name',
      type: 'boolean',
      required: true,
    })
    restaurantName: string
    
    @IsString()
    @IsOptional()
    @ApiProperty({
      name: 'message',
      description: 'city name',
      type: 'boolean',
      required: true,
    })
    city: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
      name: 'status',
      description: 'status',
      type: 'boolean',
      required: true,
    })
    @Transform(({value})=>{
        if(value == 'true') return true
        else if(value == 'false') return false
    })
    isActive: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
      name: 'status',
      description: 'status',
      type: 'boolean',
      required: true,
    })
    @Transform(({value})=>{
        if(value == 'true') return true
        else if(value == 'false') return false
    })
    isVerified: boolean;
}
