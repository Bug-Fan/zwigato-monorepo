import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[MailModule],
  controllers: [CouponController],
  providers: [CouponService]
})
export class CouponModule {}
