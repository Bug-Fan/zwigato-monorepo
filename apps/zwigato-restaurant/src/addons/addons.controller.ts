import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AddonsService } from './addons.service';
import { AddAddonDto } from './dto/request/addaddOn.dto';
import { DeleteParamAddOns } from './dto/request/deleteAddonParam.dto';
import { GetAddonDto } from './dto/request/getAddOn.dto';
import { UpdateAddOns } from './dto/request/updateAddon.dto';
import { UpdateAvaililibilyParamDTO } from './dto/request/updateAvailibilityParams.request.dto';
import { UpdateAvaililibilyBodyDTO } from './dto/request/updateAvaililibilyBody.request.dto';
import { UpdateAddonParamsDTO } from './dto/request/updateAddonParam.dto';
import { CommonResDto } from 'src/dto/commonResponse.dto';
@ApiTags('addOns')
@Controller('addons')
export class AddonsController {
  constructor(private addonsService: AddonsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addAddOn(@Body() addAddonDto: AddAddonDto, @Req() request) {
    return await this.addonsService.addAddOn(
      addAddonDto,
      request.user.restaurantId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:menuAddOnId')
  async updateAddon(
    @Req() request,
    @Param() updateAddonParamsDTO: UpdateAddonParamsDTO,
    @Body() updateAddOns: UpdateAddOns,
  ) {
    return await this.addonsService.updateAddons(
      request.user.restaurantId,
      updateAddonParamsDTO,
      updateAddOns,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:menuAddOnId')
  async removeAddons(
    @Req() request,
    @Param() deleteParamAddOns: DeleteParamAddOns,
  ): Promise<CommonResDto> {
    return await this.addonsService.deleteAddon(
      request.user.restaurantId,
      deleteParamAddOns,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('updateAvailability/:menuAddOnId')
  async setAvailability(
    @Req() request,
    @Param() updateparams: UpdateAvaililibilyParamDTO,
    @Body() updateAvailibilityBody: UpdateAvaililibilyBodyDTO,
  ) {
    return await this.addonsService.updateAddOnAvailibility(
      request.user.restaurantId,
      updateparams,
      updateAvailibilityBody,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  async getMenuItem(@Req() request, @Query() getAddonDto: GetAddonDto) {
    return await this.addonsService.getAddons(
      request.user.restaurantId,
      getAddonDto,
    );
  }
}
