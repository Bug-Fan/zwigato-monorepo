import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartAddons } from './cartAddons.entity';
import { Coupon } from './coupon.entity';
import { Customer } from './customer.entity';
import { Restaurant } from './restaurant.entity';
import { RestaurantMenu } from './restaurantMenu.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('increment')
  cartItemId: number;

  @OneToMany(() => CartAddons, (cartAddon) => cartAddon.cart, {
    cascade: true,
  })
  cartAddOns: CartAddons[];

  @ManyToOne(() => Coupon, (coupon) => coupon.cart)
  @JoinColumn({ name: 'couponId' })
  coupon: Coupon;
  @Column('numeric', { nullable: true })
  couponId: number;

  @Column('numeric', { scale: 0 })
  quantity: number;

  @ManyToOne(() => RestaurantMenu, (menu) => menu.cart)
  @JoinColumn({ name: 'menuItemId' })
  menu: RestaurantMenu;
  @Column()
  menuItemId: number;

  @ManyToOne(() => Customer, (cust) => cust.cart)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
  @Column()
  customerId: string;

  @ManyToOne(() => Restaurant, (rest) => rest.cart)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
  @Column()
  restaurantId: string;
}
