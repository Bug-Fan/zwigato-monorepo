import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GetOrderResponseDto } from './dto/response/getorders.response.dto';
import { GetRestaurantResponseDto } from './dto/response/getrestaurant.response.dto';
import { ManagerService } from './manager-dashboard.service';
import { RoleGuard } from 'src/role.guard';
import { ROLE_CONSTANT } from 'src/roleConstants';


@UseGuards(AuthGuard('jwt'),new RoleGuard(ROLE_CONSTANT.ROLES.MANAGER))
@ApiTags('Manager')
@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService){};
  @Get('getRestaurant')
  @ApiBearerAuth()
  @ApiBody({ type: GetRestaurantResponseDto })
  @ApiCreatedResponse({
    type: GetRestaurantResponseDto,
    description: 'Get Restaurant Details',
  })
  getRestaurant(
    @Query() queryData,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.managerService.getRestaurant(queryData, page, limit);
  }


  @Get('getallOrders')
  @ApiBearerAuth()
  @ApiBody({ type: GetOrderResponseDto })
  @ApiCreatedResponse({
    type: GetOrderResponseDto,
    description: 'Get orders Details',
  })
  getAllOrders(
    @Query() queryData,
  ) {
    return this.managerService.getAllOrders(queryData);
  }
}
