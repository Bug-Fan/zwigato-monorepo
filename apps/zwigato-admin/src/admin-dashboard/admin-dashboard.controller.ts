import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AdminService } from './admin-dashboard..service';
import { VerifyStatusReqDto } from './dto/request/verifyStatusReq.dto';
import { GetCustomersResponseDto } from './dto/response/getcustomers.response.dto';
import { GetDeliveryBoyResponseDto } from './dto/response/getdeliveryboy.response.dto';
import { getOredersResponseDto } from './dto/response/getOrders.response.dto';
import { VerifyStatusResDto } from './dto/response/verifyStatusRes.dto';
import { DateValidate } from 'src/pipes/isdate.pipe';
import { EarningRequestDTO } from './dto/request/earning.request.dto';
import { RoleGuard } from 'src/role.guard';
import { ROLE_CONSTANT } from 'src/roleConstants';

@UseGuards(AuthGuard('jwt'),new RoleGuard(ROLE_CONSTANT.ROLES.ADMIN))
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Patch('restaurantVerify/:uuid')
  @ApiBearerAuth()
  @ApiBody({ type: VerifyStatusReqDto })
  @ApiCreatedResponse({
    type: VerifyStatusResDto,
    description: 'Verified Status',
  })
  restaurantVerify(
    @Param('uuid') uuid: string,
    @Body() verifyStatusReqDto: VerifyStatusReqDto,
  ): Promise<VerifyStatusResDto> {
    return this.adminService.restaurantRequestVerify(uuid, verifyStatusReqDto);
  }

  @Patch('deliveryAgentVerify/:uuid')
  @ApiBearerAuth()
  @ApiBody({ type: VerifyStatusReqDto })
  @ApiCreatedResponse({
    type: VerifyStatusResDto,
    description: 'Verified Status',
  })
  deliveryAgentVerify(
    @Param('uuid') uuid: string,
    @Body() verifyStatusReqDto: VerifyStatusReqDto,
  ): Promise<VerifyStatusResDto> {
    return this.adminService.deliveryAgentRequestVerify(
      uuid,
      verifyStatusReqDto,
    );
  }

  @Get('getRestaurant')
  @ApiBearerAuth()
  @ApiBody({ type: VerifyStatusReqDto })
  @ApiCreatedResponse({
    type: VerifyStatusResDto,
    description: 'Get Restaurant Details',
  })
  getRestaurant(
    @Query() queryData,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getRestaurant(queryData, page, limit);
  }

  @Get('getDeliveryBoy')
  @ApiBearerAuth()
  @ApiBody({ type: GetDeliveryBoyResponseDto })
  @ApiCreatedResponse({
    type: GetDeliveryBoyResponseDto,
    description: 'Get Delivery boy Details',
  })
  getDeliveryBoy(
    @Query() queryData,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getDeliveryBoy(queryData, page, limit);
  }

  @Get('getallCustomer')
  @ApiBearerAuth()
  @ApiBody({ type: GetDeliveryBoyResponseDto })
  @ApiCreatedResponse({
    type: GetCustomersResponseDto,
    description: 'Get Customer Details',
  })
  getAllCustomer(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getAllCustomer( page, limit);
  }

  @Get('getallOrders')
  @ApiBearerAuth()
  @ApiBody({ type: getOredersResponseDto })
  @ApiCreatedResponse({
    type: getOredersResponseDto,
    description: 'Get orders Details',
  })
  getAllOrders(
    @Query() queryData,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getAllOrders( page, limit);
  }

  @Get('earning')
  async getEarnings(
    @Query(DateValidate) earningReqDTO: EarningRequestDTO,
  ) {
    return await this.adminService.getEarnings(
      earningReqDTO
    );
  }
}
