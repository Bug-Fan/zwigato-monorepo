import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { DeliveryAgent } from './deliveryAgent.entity';

@Entity()
export class OrderBroadcast {
  @PrimaryColumn('uuid')
  orderId: string;

  @PrimaryColumn('uuid')
  deliveryAgentId: string;

  @ManyToOne(() => Order, (order) => order.orderBroadcast)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(
    () => DeliveryAgent,
    (deliveryAgent) => deliveryAgent.orderBroadcast,
  )
  @JoinColumn({ name: 'deliveryAgentId' })
  deliveryAgent: DeliveryAgent;
}
