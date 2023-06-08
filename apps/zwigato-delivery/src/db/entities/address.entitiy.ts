import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('increment')
  addressId: number;

  @ManyToOne(() => Customer, (cust) => cust.address)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
  @Column('uuid')
  customerId: string;

  @Column('text')
  addressLine1: string;

  @Column('text', { nullable: true })
  addressLine2: string;

  @Column('text')
  pincode: string;

  @Column('text')
  city: string;

  @Column('text')
  state: string;

  @Column('text')
  addressLatitude: string;

  @Column('text')
  addressLongitude: string;
}
