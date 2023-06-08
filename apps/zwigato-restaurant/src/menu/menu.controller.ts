import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetMenuItemsRequestDTO } from './dto/request/getMenuItem.request.dto';
import { MenuService } from './menu.service';
import { AuthGuard } from '@nestjs/passport';
import { AddMenuItemDto } from './dto/request/addMenuItem.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { menuItemStorage } from 'src/database/storage.helper';
import { DeleteMenuItemRequestDTO } from './dto/request/deleteMenuItem.request.dto';
import { UpdateAvaililibilyBodyDTO } from './dto/request/updateAvaililibilyBody.request.dto';
import { GetMenuItemsResponse } from './dto/response/getMenuItems.response.dto';
import { UpdateMenuItemRequestDTO } from './dto/request/updateMenuItem.request.dto';
import { UpdateAvaililibilyParamDTO } from './dto/request/updateAvailibilityParams.request.dto';
import { UpdateMenuItemParamsDTO } from './dto/request/updateMenuItemParams.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommonResDto } from 'src/dto/commonResponse.dto';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMenuItems(
    @Req() request,
    @Query() menuItemDto: GetMenuItemsRequestDTO,
  ): Promise<GetMenuItemsResponse> {
    return await this.menuService.getMenuItems(
      request.user.restaurantId,
      menuItemDto.query,
    );
  }

  @UseInterceptors(FileInterceptor('itemImage', menuItemStorage))
  @UseGuards(AuthGuard('jwt'))
  @Post('addItem')
  async addMenuItem(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png|jpeg)/ }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    itemImage: Express.Multer.File,
    @Req() request,
    @Body() menuItemDto: AddMenuItemDto,
  ): Promise<CommonResDto> {
    return await this.menuService.addMenuItem(
      menuItemDto,
      request.user.restaurantId,
      itemImage.filename,
    );
  }

  @UseInterceptors(FileInterceptor('itemImage', menuItemStorage))
  @UseGuards(AuthGuard('jwt'))
  @Patch('updateMenuItem/:itemId')
  async updateMenuItem(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png|jpeg)/ }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
        fileIsRequired: false,
      }),
    )
    itemImage: Express.Multer.File,
    @Req() request,
    @Param() menuItemParams: UpdateMenuItemParamsDTO,
    @Body() menuItemBody: UpdateMenuItemRequestDTO,
  ): Promise<CommonResDto> {
    return await this.menuService.updateMenuItem(
      itemImage?.filename,
      menuItemBody,
      menuItemParams,
      request.user.restaurantId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:itemId')
  async removeItem(
    @Req() request,
    @Param() deleteMenuItem: DeleteMenuItemRequestDTO,
  ): Promise<CommonResDto> {
    return await this.menuService.deleteMenuItem(
      request.user.restaurantId,
      deleteMenuItem,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('updateAvailability/:itemId')
  async setAvailability(
    @Req() request,
    @Param() updateparams: UpdateAvaililibilyParamDTO,
    @Body() updateAvailibilityBody: UpdateAvaililibilyBodyDTO,
  ): Promise<CommonResDto> {
    return await this.menuService.updateProductAvailibility(
      request.user.restaurantId,
      updateparams,
      updateAvailibilityBody,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getFoodCategories')
  getFoodCategory() {
    return this.menuService.getFoodCategoryTypes();
  }
}
