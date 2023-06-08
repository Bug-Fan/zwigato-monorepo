import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { Customer } from './customer.entity';
import { Order } from './order.entity';

@Entity()
export class UsedCoupons {
  @ManyToOne(() => Customer, (customer) => customer.userCoupon)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
  @PrimaryColumn('string')
  customerId: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.usedCoupon)
  @JoinColumn({ name: 'couponId' })
  coupon: Coupon;
  @PrimaryColumn('numeric')
  couponId: number;
}
