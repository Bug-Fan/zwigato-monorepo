import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity()
export class RestaurantType {
  @PrimaryGeneratedColumn('increment')
  restaurantTypeId: number;

  @OneToMany(() => Restaurant, (rest) => rest.restaurantType)
  restaurant: Restaurant[];

  @Column('text')
  restaurantTypeName: string;
}
