import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { DeliveryAgent } from './deliveryAgent.entity';

@Entity()
export class OrderBroadcast {

  @ManyToOne(() => Order, (order) => order.orderBroadcast)
  @JoinColumn({ name: 'orderId' })
  order: Order;
  @PrimaryColumn('uuid')
  orderId: string;
  @ManyToOne(
    () => DeliveryAgent,
    (deliveryAgent) => deliveryAgent.orderBroadcast,
  )
  @JoinColumn({ name: 'deliveryAgentId' })
  deliveryAgent: DeliveryAgent;
  @PrimaryColumn('uuid')
  deliveryAgentId: string;
}

//bubble sort method
