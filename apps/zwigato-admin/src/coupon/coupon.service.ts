import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { MailService } from "src/mail/mail.service";
import { EntityManager, DataSource } from "typeorm";
import { AddCouponDto } from "./dto/request/addCoupon.dto";
import { Coupon } from "src/db/entities/coupon.entity";
import { CommonResDto } from "src/dto/common_res.dto";
import { DeleteParamCoupon } from "./dto/request/deleteCouponParam.dto";
import { GetCouponResponse } from "./dto/response/getCoupon.res.dto";

@Injectable()
export class CouponService {
  private manager: EntityManager;
  constructor(
    @Inject("DataSource") private dataSource: DataSource,
    private mailService: MailService
  ) {
    this.manager = this.dataSource.manager;
  }

  async addCoupons(coupondatadto: AddCouponDto): Promise<CommonResDto> {
    const addCoupon = this.manager.create(Coupon, coupondatadto);
    try {
      await this.manager.save(addCoupon);
      return new CommonResDto(false, "Coupon Added..");
    } catch (error) {
      if (error.code && error.code == 23505)
        throw new BadRequestException("Coupon already exists");
      else {
      throw new BadRequestException('Something Went to Wrong')
      }
    }
  }

  async deleteCoupon(id: DeleteParamCoupon): Promise<CommonResDto> {
    let deleteResult;
    try {
      const findData = await this.manager.findOne(Coupon, {
        where: { couponId: id.couponId },
      });
      if (findData) {
        deleteResult = await this.manager.update(
          Coupon,
          { couponId: id.couponId },
          { isDeleted: true }
        );
        this.manager.softDelete(Coupon, {
          couponId: id.couponId,
        });
      } else {
        throw new BadRequestException(`Coupon with that id doesn't exist`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    if (deleteResult)
      return new CommonResDto(false, "Coupon deleted successfuly");
    else throw new BadRequestException("Coupon not found");
  }

  async getCoupon(page, limit) {
    const take = limit || 3;
    const skip = (page - 1) * limit;
    const data = await this.manager.find(Coupon, {
      relations: ["couponCategory"],
      take,
      skip,
    });
    try {
      if (data) {
        return new GetCouponResponse(false, "Coupon Data", data);
      }else{
        throw new BadRequestException("Data not found")
      }
    } catch (error) {
    throw new BadRequestException(error.message);
    }
  }
}
