import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantUpdateDto } from './dto/request/restaurantUpdateDetails.request.dto';
import { RestaurantService } from './restaurant.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/database/storage.helper';
import { UpdateBankDetailsRequest } from './dto/request/restaurantUpdateBank.request.dto';
import { UpdateAvaililibilyParamDTO } from 'src/menu/dto/request/updateAvailibilityParams.request.dto';
import { UpdateAvaililibilyBodyDTO } from 'src/menu/dto/request/updateAvaililibilyBody.request.dto';
import { UpdateResult } from 'typeorm';
import { Restaurant } from 'src/database/entities/restaurant.entity';
import { UpdateRestaurantAvailibilityDTO } from './dto/request/updateRestaurantAvailability.request.dto';
import { RestaurantProfileRes } from './dto/response/restaurantData.res.dto';
import { CommonResDto } from 'src/dto/commonResponse.dto';
import { EarningRequestDTO } from './dto/request/earning.request.dto';
import { DateValidate } from 'src/pipes/dateValidation.pipe';

@UseGuards(AuthGuard('jwt'))
@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurentService: RestaurantService) {}

  @UseInterceptors(AnyFilesInterceptor(storage))
  @Patch('updateProfile')
  async updateRestaurantDetails(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png|jpeg)/ }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Array<Express.Multer.File>,

    @Req() request,
    @Body() restaurantDetails: RestaurantUpdateDto,
  ) {
    let path;
    if (file && file[0]) path = file[0].filename;
    return await this.restaurentService.updateRestuarentDetails(
      restaurantDetails,
      path,
      request.user.restaurantId,
    );
  }
  @UseInterceptors(AnyFilesInterceptor(storage))
  @Patch('updateBankDetails')
  async updateBankDetails(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png|jpeg)/ }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    passBookImage: Array<Express.Multer.File>,

    @Req() request,
    @Body() bankdetails: UpdateBankDetailsRequest,
  ) {
    let path;
    if (passBookImage && passBookImage[0]) path = passBookImage[0].filename;
    return await this.restaurentService.updateBankDetails(
      bankdetails,
      path,
      request.user.restaurantId,
    );
  }

  @Patch('updateAvailability')
  async setAvailability(
    @Req() request,
    @Body() updateAvailibility: UpdateRestaurantAvailibilityDTO,
  ): Promise<CommonResDto> {
    return await this.restaurentService.updateAvailibility(
      request.user.restaurantId,
      updateAvailibility,
    );
  }

  @Get('getProfile')
  async getProfile(@Req() request): Promise<RestaurantProfileRes> {
    return await this.restaurentService.getRestaurantProfile(
      request.user.restaurantId,
    );
  }

  @Get('earning')
  async getEarnings(
    @Req() request,
    @Query(DateValidate) earningReqDTO: EarningRequestDTO,
  ) {
    return await this.restaurentService.getEarnings(
      earningReqDTO,
      request.user.restaurantId,
    );
  }
}
