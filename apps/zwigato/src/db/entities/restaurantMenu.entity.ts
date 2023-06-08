import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Cart } from './cart.entity';
import { FoodCategory } from './foodCategory.entity';
import { Restaurant } from './restaurant.entity';
import { RestaurantMenuAddOns } from './restaurantMenuAddOns.entity';

export enum FoodType {
  VEG = 'Veg',
  NONVEG = 'NonVeg',
  OTHER = 'Other',
}
@Entity()
@Index(['restaurantId', 'itemName'], {
  unique: true,
  where: 'deletedat IS NULL',
})
export class RestaurantMenu {
  @PrimaryGeneratedColumn('increment')
  itemId: number;

  @OneToMany(() => Cart, (cart) => cart.menu)
  cart: Cart[];

  @OneToMany(() => RestaurantMenuAddOns, (addon) => addon.menu)
  addOns: RestaurantMenuAddOns[];

  @ManyToOne(() => Restaurant, (rest) => rest.restaurantMenu)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
  @Column('uuid')
  restaurantId: string;

  @ManyToOne(() => FoodCategory, (cate) => cate.restaurantMenu)
  @JoinColumn({ name: 'foodCategoryId' })
  foodCategory: FoodCategory;
  @Column('numeric')
  foodCategoryId: number;

  @Column('citext')
  itemName: string;

  @Column('text')
  itemDescription: string;

  @Column('enum', { enum: FoodType })
  foodType: FoodType;

  @Column('text')
  itemImagePath: string;

  @Column('numeric', { scale: 2 })
  MRP: number;

  @Column({ default: 0, scale: 2 })
  discount: number;

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @Column('numeric', { nullable: true })
  ratingAVG: number;

  @DeleteDateColumn({ name: 'deletedat' })
  deletedat: Date;
}
