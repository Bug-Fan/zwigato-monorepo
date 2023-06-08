import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderAddOns } from './orderAddOns.entity';

@Entity()
export class OrderItems {
  @PrimaryGeneratedColumn('increment')
  orderItemId: number;

  @OneToMany(() => OrderAddOns, (orderAddon) => orderAddon.orderItems)
  orderAddOn: OrderAddOns[];

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;
  @Column('uuid')
  orderId: string;

  @Column('numeric')
  itemId: number;

  @Column('text')
  itemName: string;

  @Column('numeric')
  quantity: number;

  @Column('numeric', { scale: 2 })
  itemTotalAmount: number;

  @Column('numeric', { nullable: true })
  rating: number;

  @Column('text', { nullable: true })
  remarks: string;

  @Column('numeric', { scale: 2 })
  itemPrice: number;
}
