import { CommonResDto } from "src/dto/common_res.dto";


export class GetCouponResponse extends CommonResDto {
  data: CouponRes[];

  constructor(isError, message,coupons) {
    super(isError, message);
    this.data = coupons.map((item) => new CouponRes(item));
  }
}

export class CouponRes {
  couponId: string;
  couponCodeName: string;
  discountPercent: number;
  MinOrderValue:number;
  createdAt:string;
  couponCategoryId: couponCategoryData;
  expireDate: string;
  deletedAt: string;
  isDeleted: boolean

  constructor(obj) {
    this.couponId=obj;
    this.couponCodeName;
    this.discountPercent;
    this.MinOrderValue;
    this.createdAt;
    this.couponCategoryId;
  
  }
}


export class couponCategoryData {

}
