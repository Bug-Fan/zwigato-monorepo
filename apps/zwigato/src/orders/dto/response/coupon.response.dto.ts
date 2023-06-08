import { Coupon } from 'src/db/entities/coupon.entity';
import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class CouponResponseDto extends CommonResponseDto {
  data: CouponResponseData[];

  constructor(isError: boolean, message: string, coupons: Coupon[]) {
    super(isError, message);
    this.data = coupons.map((coupon: Coupon) => new CouponResponseData(coupon));
  }
}

export class CouponResponseData {
  couponId: number;
  couponCodeName: string;
  minOrderValue: number;
  expiryDate: Date;
  categoryName: string;
  discountPercent: number;

  constructor(coupon: Coupon) {
    this.couponId = coupon.couponId;
    this.couponCodeName = coupon.couponCodeName;
    this.categoryName = coupon.couponCategory.categoryName;
    this.expiryDate = coupon.expireDate;
    this.minOrderValue = coupon.MinOrderValue;
    this.discountPercent = coupon.discountPercent;
  }
}
