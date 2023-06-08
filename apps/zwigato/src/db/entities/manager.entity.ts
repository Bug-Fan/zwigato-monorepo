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
import { Restaurant } from './restaurant.entity';
import { DeliveryAgent } from './deliveryAgent.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  managerId: string;

  @OneToMany(() => Restaurant, (rest) => rest.manager)
  restaurant: Restaurant[];

  @OneToMany(() => DeliveryAgent, (agent) => agent.manager)
  deliveryAgent: DeliveryAgent[];

  @Column('text')
  managerName: string;

  @Column('text', { unique: true })
  managerEmail: string;

  @Column('text')
  managerPassword: string;

  @Column('text')
  managerPhone: string;

  @Column('timestamptz')
  joinedDate: Date;

  @CreateDateColumn()
  registerdAt: Date;
}
