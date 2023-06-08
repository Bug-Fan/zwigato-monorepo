import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderGetById } from './dto/request/orderGetById .dto';
import { FilterByStatus } from './dto/request/searchByStatus.dto';
import { UpdateOrderById } from './dto/request/updateOrderById.dto';
import { UpdateOrderData } from './dto/request/updateOrderData.dto';
import { UpdateOrderStatus } from './dto/request/updateOrderStatus.dto';
import { GetOrderDetailsRes } from './dto/response/getOrderDetails.res.dto';
import { OrderService } from './order.service';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('allOrder/:orderStatus')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getAllOrder(
    @Req() req,
    @Param() filterByStatus: FilterByStatus,
  ): Promise<GetOrderDetailsRes> {
    const restaurantId = req.user.restaurantId;
    return this.orderService.getOrders(
      restaurantId,
      filterByStatus.orderStatus,
    );
  }

  @Get('orderById/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getOrderById(
    @Req() req,
    @Param() getOrderById: OrderGetById,
  ): Promise<GetOrderDetailsRes> {
    const restaurantId = req.user.restaurantId;
    return this.orderService.getOrdersById(restaurantId, getOrderById.orderId);
  }

  @Patch('updatestatus/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  updateOrderConformation(
    @Req() req,
    @Param() updateOrderById: UpdateOrderById,
    @Query() updateOrderStatus: UpdateOrderStatus,
  ) {
    const restaurantId = req.user.restaurantId;
    return this.orderService.updateConformation(
      restaurantId,
      updateOrderById.orderId,
      updateOrderStatus.orderStatus,
    );
  }

  @Patch('updateOrderStatus/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: UpdateOrderData })
  updateOrderStatus(
    @Req() req,
    @Param() updateOrderById: UpdateOrderById,
    @Body() updateOrderData: UpdateOrderData,
  ) {
    const restaurantId = req.user.restaurantId;
    return this.orderService.updateOrderStatus(
      restaurantId,
      updateOrderById.orderId,
      updateOrderData,
    );
  }

  @Get('getDeliveryAgent/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getDeliveryAgent(@Req() req, @Param() getOrderById: OrderGetById) {
    const restaurantId = req.user.restaurantId;
    return this.orderService.getAgent(restaurantId, getOrderById.orderId);
  }
}
