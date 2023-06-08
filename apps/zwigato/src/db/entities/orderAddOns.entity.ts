import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { DeliveryAgent } from './deliveryAgent.entity';
import { OrderItems } from './orderItems.entity';

@Entity()
export class OrderAddOns {
  @PrimaryGeneratedColumn('increment')
  orderAddOnId: number;

  @ManyToOne(() => OrderItems, (orderItem) => orderItem.orderAddOn)
  @JoinColumn({ name: 'orderItemId' })
  orderItems: OrderItems;
  @Column()
  orderItemId: number;

  @Column('text')
  orderAddonName: string;

  @Column('numeric', { scale: 2 })
  orderAddOnPrice: number;

  @Column('numeric')
  quantity: number;

  @Column('numeric', { scale: 2 })
  totalAddonPrice: number;
}
