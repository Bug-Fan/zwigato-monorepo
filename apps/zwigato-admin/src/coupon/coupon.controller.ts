import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { AuthGuard } from '@nestjs/passport';
import { AddCouponDto } from './dto/request/addCoupon.dto';
import { DeleteParamCoupon } from './dto/request/deleteCouponParam.dto';
import { CommonResDto } from 'src/dto/common_res.dto';
import { GetCouponResponse } from './dto/response/getCoupon.res.dto';
import { DateValidate } from 'src/pipes/isdate.pipe';

@UseGuards(AuthGuard('jwt'))
@Controller('coupon')
export class CouponController {
  constructor(private couponService: CouponService) { }
  
  @Post('/addCoupon')
  @UsePipes(new DateValidate())
  addCoupon(@Body() addCouponDto: AddCouponDto) {
    return this.couponService.addCoupons(addCouponDto);
  }

  @Get('/getAllCoupon')
  getCoupon( @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number,):Promise<GetCouponResponse>{
    return this.couponService.getCoupon(page,limit);
  }

  @Delete('/deleteCoupon/:couponId')
  deleteCoupon(@Param() deleteParamCoupon:DeleteParamCoupon): Promise<CommonResDto> {
    return this.couponService.deleteCoupon(deleteParamCoupon);
  }
}
