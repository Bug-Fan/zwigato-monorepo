import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Coupon } from './coupon.entity';

export enum couponCategoryNames {
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  BRONZE = 'BRONZE',
  FESTIVE = 'FESTIVE',
}
@Entity()
export class CouponCategory {
  @PrimaryGeneratedColumn('increment')
  categoryId: number;

  @OneToMany(() => Coupon, (coupon) => coupon.couponCategory)
  coupon: Coupon[];

  @Column({ type: 'enum', enum: couponCategoryNames })
  categoryName: couponCategoryNames;

  @Column('numeric')
  MinOrderValuePerMonth: number;
}
