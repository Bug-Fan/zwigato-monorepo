import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeoCoddingService } from './geoCodding.service';
import { Test } from '@nestjs/testing';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let geoCoddingService: GeoCoddingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, GeoCoddingService],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
    geoCoddingService = moduleRef.get<GeoCoddingService>(GeoCoddingService);
    appController = moduleRef.get<AppController>(AppController);
  });

  describe('findDistance', () => {
    it('should return string', async () => {
      const result = 26.915;
      jest
        .spyOn(geoCoddingService, 'findDistance')
        .mockImplementation(async () => result);

      expect(await appController.getHello()).toBe(result);
    });
  });
});
