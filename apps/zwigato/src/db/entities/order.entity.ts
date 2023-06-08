import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { DeliveryAgent } from './deliveryAgent.entity';
import { OrderItems } from './orderItems.entity';
import { Restaurant } from './restaurant.entity';
import { UsedCoupons } from './usedCoupons.entity';
import { OrderBroadcast } from './orderBroadcast.entity';
import { Coupon } from './coupon.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READYTOPICKUP = 'READYTOPICKUP',
  DISPATCHED = 'DISPATCHED',
  ARRIVED = 'ARRIVED',
  DELIVERED = 'DELIVERED',
}
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @OneToMany(() => OrderItems, (orderItem) => orderItem.order)
  orderItems: OrderItems[];

  @OneToMany(() => OrderBroadcast, (orderBroadcast) => orderBroadcast.order)
  orderBroadcast: OrderBroadcast[];

  @ManyToOne(() => Coupon, (coupon) => coupon.order)
  @JoinColumn({ name: 'couponId' })
  coupon: Coupon;
  @Column('numeric', { nullable: true })
  couponId: number;

  @ManyToOne(() => Restaurant, (rest) => rest.order)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
  @Column('uuid')
  restaurantId: string;

  @ManyToOne(() => Customer, (cust) => cust.order)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
  @Column('uuid')
  customerId: string;

  @ManyToOne(() => DeliveryAgent, (deliveryAgent) => deliveryAgent.order)
  @JoinColumn({ name: 'deliveryAgentId' })
  deliveryAgent: DeliveryAgent;
  @Column('uuid', { nullable: true })
  deliveryAgentId: string;

  @Column('text')
  deliveryAddress: string;

  @Column('numeric', { scale: 2 })
  subTotal: number;

  @Column('numeric', { scale: 2 })
  sgst: number;

  @Column('numeric', { scale: 2 })
  cgst: number;

  @Column('numeric', { scale: 2 })
  totalAmount: number;

  @Column('numeric', { scale: 2 })
  deliveryCharges: number;

  @Column('numeric', { scale: 2 })
  deliveryAgentProfit: number;

  @Column('numeric', { scale: 2 })
  resaturantProfit: number;

  @Column('numeric', { scale: 2 })
  platformProfit: number;

  @Column('numeric', { nullable: true })
  prepareTime: number;

  @Column('enum', { enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Column('numeric')
  discountedPrice: number;

  @Column('boolean', { default: false })
  isrestaurantAccepted: boolean;

  @Column('boolean', { default: false })
  isDeliveryAccepted: boolean;

  @Column('numeric', { nullable: true })
  deliveryRatings: number;

  @Column('text', { nullable: true })
  deliveryRemarks: string;

  @Column('text', { nullable: true })
  rejectionReason: string;

  @Column('timestamptz', { nullable: true })
  deliveredOn: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  orderPlacedOn: Date;

  @Column('text')
  addressLatitude: string;

  @Column('text')
  addressLongitude: string;

  @Column('numeric', { nullable: true })
  ratingToCustomer: number;

  @Column('text', { nullable: true })
  remarkToCustomer: string;
}
