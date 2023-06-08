import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Check,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Manager } from './manager.entity';
import { OrderBroadcast } from './orderBroadcast.entity';

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
}

export enum TshirtSize {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}

@Entity()
export class DeliveryAgent {
  @PrimaryGeneratedColumn('uuid')
  agentId: string;

  @OneToMany(() => Order, (order) => order.deliveryAgent)
  order: Order[];

  @OneToMany(
    () => OrderBroadcast,
    (orderBroadcast) => orderBroadcast.deliveryAgent,
  )
  orderBroadcast: OrderBroadcast[];

  @Column('text')
  agentName: string;

  @Column('text', { unique: true })
  agentEmail: string;

  @Column('text')
  agentPassword: string;

  @Column('text')
  agentProfilePath: string;

  @Column('text')
  agentAddressLine1: string;

  @Column('text', { nullable: true })
  agentAddressLine2: string;

  @Column('text')
  pincode: string;

  @Column('text')
  city: string;

  @Column('text')
  state: string;

  @Column('text')
  agentLatitude: string;

  @Column('text')
  agentLongitude: string;

  @Column('text', { unique: true })
  agentPhone: string;

  @ManyToOne(() => Manager, (manager) => manager.deliveryAgent)
  @JoinColumn({ name: 'managerId' })
  manager: Manager;
  @Column('text', { nullable: true })
  managerId: string;

  @Column('text')
  adharcardImagePath: string;

  @Column('text')
  licenceImagePath: string;

  @Column('text')
  adharcardNumber: string;

  @Column('text')
  licenceNumber: string;

  @Column('text')
  vehicaleNumber: string;

  @Column('text')
  agentRCBookImagePath: string;

  @Column('text')
  passBookImagePath: string;

  @Column('text')
  bankName: string;

  @Column('text')
  bankIFSC: string;

  @Column('text')
  bankAccountNumber: string;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('boolean', { default: false })
  isActive: boolean;

  @Column('boolean', { default: false })
  isDeposited: boolean;

  @Column('text', { nullable: true })
  OTP: string;

  @Column('boolean', { default: false })
  isEmailVerified: boolean;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @Column('enum', { enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType;

  @CreateDateColumn()
  registerdAt: Date;

  @Column('timestamptz', { nullable: true })
  joinedDate: Date;

  @Column('timestamptz', { nullable: true })
  firstOrderDate: Date;

  @Column('boolean', { default: true })
  isFree: boolean;

  @Column('enum', { enum: TshirtSize, nullable: true })
  tshirtSize: TshirtSize;
}
