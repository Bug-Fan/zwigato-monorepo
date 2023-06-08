import { Test } from "@nestjs/testing";
import { CouponController } from "./coupon.controller";
import { CouponService } from "./coupon.service";
import { MailService } from "src/mail/mail.service";
import { AddCouponDto } from "./dto/request/addCoupon.dto";

describe("couponController", () => {
  let couponController: CouponController;
  let spyService: CouponService;

  beforeAll(async () => {
    let module = await Test.createTestingModule({
      providers: [
        CouponController,
        {
          provide: CouponService,
          useFactory: () => ({
            addCoupons: jest.fn(() => []),
            getCoupon: jest.fn(() => []),
            deleteCoupon: jest.fn(() => []),
          }),
        },
        { provide: MailService, useValue: {} },
      ],
    }).compile();

    couponController = module.get<CouponController>(CouponController);
    spyService = module.get<CouponService>(CouponService);
  });

  it("calling addcoupon", () => {
    const dto = new AddCouponDto();
    expect(couponController.addCoupon(dto)).not.toEqual(null);
    expect(spyService.addCoupons).toHaveBeenCalled();
    expect(spyService.addCoupons).toHaveBeenCalledWith(dto);
  });
});
