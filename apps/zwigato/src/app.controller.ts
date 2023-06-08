import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryForRestoRequestDto } from './dto/request/query.resto.request.dto';
import { GetRestaurantResponseDto } from './dto/response/restaurant.response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('searchfromresto')
  async getItems(
    @Query() queryRestoReqDto: QueryForRestoRequestDto,
  ): Promise<GetRestaurantResponseDto> {
    return this.appService.getItems(queryRestoReqDto);
  }
}
