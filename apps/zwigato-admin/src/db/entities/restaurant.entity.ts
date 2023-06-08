import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { RestaurantMenu } from './restaurantMenu.entity';
import { RestaurantType } from './restaurantType.entity';
import { Manager } from './manager.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  restaurantId: string;

  @OneToMany(() => RestaurantMenu, (restMenu) => restMenu.restaurant)
  restaurantMenu: RestaurantMenu[];

  @OneToMany(() => Order, (order) => order.restaurant)
  order: Order[];

  @OneToMany(() => Cart, (cart) => cart.restaurant)
  cart: Cart[];

  @Column('text')
  restaurantName: string;

  @ManyToOne(() => RestaurantType, (restType) => restType.restaurant)
  @JoinColumn({ name: 'restaurantTypeId' })
  restaurantType: RestaurantType;
  @Column()
  restaurantTypeId: number;

  @Column('text')
  restaurantAddressLine1: string;

  @Column('text', { nullable: true })
  restaurantAddressLine2: string;

  @Column('text')
  pincode: string;

  @Column('text')
  city: string;

  @Column('text')
  state: string;

  @Column('text')
  restaurantLatitude: string;

  @Column('text')
  restaurantLongitude: string;

  @Column('text', { unique: true })
  restaurantEmail: string;

  @Column('text')
  restaurantPassword: string;

  @Column('text')
  restaurantPhone: string;

  @ManyToOne(() => Manager, (manager) => manager.restaurant)
  @JoinColumn({ name: 'managerId' })
  manager: Manager;
  @Column('text', { nullable: true })
  managerId: string;

  @Column('text')
  pancard: string;

  @Column('text')
  gstNumber: string;

  @Column('text')
  fssai: string;

  @Column('text')
  logoPath: string;

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

  @Column('text')
  passBookImagePath: string;

  @Column('text', { nullable: true })
  OTP: string;

  @Column('boolean', { default: false })
  isEmailVerified: boolean;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  registerdAt: Date;

  @Column('timestamptz', { nullable: true })
  joinedDate: Date;

  @Column('timestamptz', { nullable: true })
  firstOrderDate: Date;
}
