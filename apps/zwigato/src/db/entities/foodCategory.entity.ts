import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RestaurantMenu } from './restaurantMenu.entity';

@Entity()
export class FoodCategory {
  @PrimaryGeneratedColumn('increment')
  categoryId: number;

  @OneToMany(() => RestaurantMenu, (menu) => menu.foodCategory)
  restaurantMenu: RestaurantMenu[];

  @Column('text')
  categoryName: string;
}
