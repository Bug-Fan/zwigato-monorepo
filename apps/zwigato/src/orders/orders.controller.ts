import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AddToCartRequestDto } from './dto/request/add.to.cart.request.dto';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guards/role.guard';
import { RatingRequestDto } from './dto/request/ratings.request.dto';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ViewCartResponseDto } from './dto/response/view.cart.response.dto';
import { OrderRatingRequestDto } from './dto/request/orderRating.request.dto';
import { OrderPlacedResponseDto } from './dto/response/order.placed.response.dto';
import { OrderHistoryResponseDto } from './dto/response/order.history.response.dto';
import { EditCartQuantityRequestDto } from './dto/request/edit.cart.quantity.request.dto';
import { AddToCartResponseDto } from './dto/response/add.to.cart.response.dto';
import { DeleteItemFromCartResponseDto } from './dto/response/delete.item.from.cart.dto';
import { ClearCartResponseDto } from './dto/response/clear.cart.response.dto';
import { EditCartItemResponseDto } from './dto/response/edit.cart.item.quantity.response.dto';
import { EditCartAddonResponseDto } from './dto/response/edit.cart.addon.response.dto';
import { OrderPayResponseDto } from './dto/response/order.pay.response.dto';
import { OrderItemRatingResponseDto } from './dto/response/order.item.rating.reponse.dto';
import { OrderRatingResponseDto } from './dto/response/order.rating.response.dto';
import { OrderCancelResponseDto } from './dto/response/order.cancel.response.dto';
import { PlaceOrderRequestDto } from './dto/request/placeorder.request.dto';
import { ApplyCodeRequestDto } from './dto/request/applyCode.request.dto';
import { CouponResponseDto } from './dto/response/coupon.response.dto';
import { ApplyCodeResponseDto } from './dto/response/apply.code.response.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), new RoleGuard('user'))
export class OrdersController {
  constructor(
    private cartService: CartService,
    private orderService: OrdersService,
  ) {}

  @Post('addtocart')
  @ApiBody({ type: AddToCartRequestDto })
  @ApiCreatedResponse({
    description: 'Item added to cart.',
  })
  @ApiNotFoundResponse({ description: 'The item you selected does not exist.' })
  @ApiBadRequestResponse({
    description:
      'One of the selected addons is not available for the selected menu item.',
  })
  @ApiConflictResponse({
    description:
      'You cannot add an item for a different restaurant when items for a restaurant exist in your cart.',
  })
  @ApiBadGatewayResponse({ description: 'Unable to add item to cart.' })
  addToCart(
    @Body() addToCartRequestDto: AddToCartRequestDto,
    @Req() req,
  ): Promise<AddToCartResponseDto> {
    return this.cartService.addToCart(addToCartRequestDto, req.user.customerId);
  }

  @Get('viewcart')
  viewCart(@Req() req): Promise<ViewCartResponseDto> {
    return this.cartService.viewCart(req.user.customerId);
  }

  @Delete('removeitemfromcart/:id')
  removeItemFromCart(
    @Param('id', ParseIntPipe) cartItemId: number,
    @Req() req,
  ): Promise<DeleteItemFromCartResponseDto> {
    return this.cartService.removeItemFromCart(cartItemId, req.user.customerId);
  }

  @Delete('clearcart')
  clearCart(@Req() req): Promise<ClearCartResponseDto> {
    return this.cartService.clearCart(req.user.customerId);
  }

  @Patch('editcartitemquantity')
  editCartItemQuantity(
    @Body() editCartItemQuantityRequestDto: EditCartQuantityRequestDto,
    @Req() req,
  ): Promise<EditCartItemResponseDto> {
    return this.cartService.editCartItemQuantity(
      editCartItemQuantityRequestDto,
      req.user.customerId,
    );
  }

  @Patch('editcartaddonquantity')
  editCartAddonQuantity(
    @Body() editCartAddonQuantityRequestDto: EditCartQuantityRequestDto,
    @Req() req,
  ): Promise<EditCartAddonResponseDto> {
    return this.cartService.editCartAddonQuantity(
      editCartAddonQuantityRequestDto,
      req.user.customerId,
    );
  }

  @Post('placeorder/:id')
  placeOrder(
    @Param('id', ParseIntPipe) addressId: number,
    @Req() req,
  ): Promise<OrderPlacedResponseDto> {
    return this.orderService.placeOrder(req.user.customerId, addressId);
  }

  @Get('orderhistory')
  async getOrderHistory(@Req() req): Promise<OrderHistoryResponseDto> {
    const customerId = req.user.customerId;
    return await this.orderService.getOrderHistory(customerId);
  }

  @Get('trackorder/:orderId')
  async trackOrder(
    @Req() req,
    @Param('orderId') orderId: string,
  ): Promise<OrderHistoryResponseDto> {
    const customerId = req.user.customerId;
    return await this.orderService.trackOrder(customerId, orderId);
  }
  @Post('pay/:id')
  payForOrder(
    @Param('id') orderId: string,
    @Req() req,
  ): Promise<OrderPayResponseDto> {
    return this.orderService.payForOrder(orderId, req.user.customerId);
  }

  @Patch('ratingforitem/:orderId')
  async ratingForItem(
    @Req() req,
    @Param('orderId') orderId: string,
    @Body() ratingReqDto: RatingRequestDto,
  ): Promise<OrderItemRatingResponseDto> {
    const customerId = req.user.customerId;
    return await this.orderService.ratingForItem(
      customerId,
      orderId,
      ratingReqDto,
    );
  }

  @Patch('ratingfororder/:orderId')
  async ratingForOrder(
    @Req() req,
    @Param('orderId') orderId: string,
    @Body() ratingReqDto: OrderRatingRequestDto,
  ): Promise<OrderRatingResponseDto> {
    const customerId = req.user.customerId;
    return await this.orderService.ratingForOrder(
      customerId,
      orderId,
      ratingReqDto,
    );
  }

  @Delete('cancelorder/:orderId')
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Req() req,
  ): Promise<OrderCancelResponseDto> {
    return this.orderService.cancelOrderByUser(orderId, req.user.customerId);
  }

  @Get('listcoupons')
  async listcoupons(@Req() req): Promise<CouponResponseDto> {
    return await this.cartService.listCoupons(req.user.customerId);
  }

  @Post('applycode')
  async applyCouponCode(
    @Body() applycodeDto: ApplyCodeRequestDto,
    @Req() req,
  ): Promise<ApplyCodeResponseDto> {
    const { couponCode } = applycodeDto;
    return await this.cartService.applyCouponCode(
      couponCode,
      req.user.customerId,
    );
  }
}
