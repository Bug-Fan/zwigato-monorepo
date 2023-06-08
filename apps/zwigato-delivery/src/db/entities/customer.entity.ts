import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entitiy';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { UsedCoupons } from './usedCoupons.entity';
import { DiffieHellmanGroup } from 'crypto';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  customerId: string;

  @OneToMany(() => Cart, (cart) => cart.customer)
  cart: Cart[];

  @OneToMany(() => UsedCoupons, (usedCoupon) => usedCoupon.customer)
  usedCoupon: UsedCoupons[];

  @OneToMany(() => Order, (order) => order.customer)
  order: Order[];

  @OneToMany(() => Address, (address) => address.customer)
  address: Address[];

  @Column('text')
  customerName: string;

  @Column('text', { unique: true })
  customerEmail: string;

  @Column('text')
  customerPassword: string;

  @Column('text')
  customerPhone: string;

  @Column('text')
  profilePath: string;

  @Column('text', { nullable: true })
  OTP: string;

  @Column('boolean', { default: false })
  isEmailVerified: boolean;

  @CreateDateColumn()
  registerdAt: Date;

  @Column('numeric', { default: 0 })
  monthOrderValue: number;
}
