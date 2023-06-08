import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Cart } from './cart.entity';
import { RestaurantMenuAddOns } from './restaurantMenuAddOns.entity';

@Entity()
export class CartAddons {
  @PrimaryGeneratedColumn('increment')
  cartAddonItemId: number;

  @ManyToOne(() => RestaurantMenuAddOns, (addOn) => addOn.cartAddOns)
  @JoinColumn({ name: 'menuAddOnID' })
  menuAddOn: RestaurantMenuAddOns;
  @Column()
  menuAddOnID: number;

  @ManyToOne(() => Cart, (cart) => cart.cartAddOns, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cartItemId' })
  cart: Cart;
  @Column()
  cartItemId: number;

  @Column('numeric', { scale: 0 })
  quantity: number;
}
