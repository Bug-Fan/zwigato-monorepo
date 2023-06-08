import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GeoCoddingService } from './geoCodding.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private geoCoddingService: GeoCoddingService,
  ) {}

  @Get()
  getHello() {
    // return this.appService.getHello();
    return this.geoCoddingService.findDistance(
      23.0225,
      72.5714,
      23.2156,
      72.6369,
    );
  }
}
