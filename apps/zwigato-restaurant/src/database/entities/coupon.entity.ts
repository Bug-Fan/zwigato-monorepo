import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CouponCategory } from './couponCategory.entity';
import { UsedCoupons } from './usedCoupons.entity';
import { Order } from './order.entity';
import { Cart } from './cart.entity';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('increment')
  couponId: number;
  @OneToMany(() => Cart, (cart) => cart.coupon)
  cart: Cart[];

  @OneToMany(() => UsedCoupons, (usedCoupons) => usedCoupons.coupon)
  usedCoupon: UsedCoupons[];

  @OneToMany(() => Order, (order) => order.coupon)
  order: Order[];

  @Column('text', { unique: true })
  couponCodeName: string;

  @Column('numeric')
  discountPercent: number;

  @Column('numeric')
  MinOrderValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CouponCategory, (category) => category.coupon)
  @JoinColumn({ name: 'couponCategoryId' })
  couponCategory: CouponCategory;
  @Column('numeric')
  couponCategoryId: number;

  @Column('timestamptz')
  expireDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @Column('boolean', { default: false })
  isExpired: boolean;
}
