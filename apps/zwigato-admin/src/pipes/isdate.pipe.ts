import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { AddCouponDto } from 'src/coupon/dto/request/addCoupon.dto';



export class DateValidate implements PipeTransform {
  transform(value: AddCouponDto, metadata: ArgumentMetadata) {

    let startDateTime = new Date(value.expireDate);

    if (startDateTime < new Date()) {
      throw new BadRequestException('ExpiredDate must be future date');
    }
    return value;
  }
}
