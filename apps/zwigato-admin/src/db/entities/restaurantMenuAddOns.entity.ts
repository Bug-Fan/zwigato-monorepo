import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartAddons } from './cartAddons.entity';

import { RestaurantMenu } from './restaurantMenu.entity';

@Entity()
@Index(['menuItemId', 'addOnName'], {
  unique: true,
  where: 'deletedat IS NULL',
})
export class RestaurantMenuAddOns {
  @PrimaryGeneratedColumn('increment')
  menuAddOnId: number;

  @OneToMany(() => CartAddons, (cartAddon) => cartAddon.menuAddOn)
  cartAddOns: CartAddons[];

  @Column('citext')
  addOnName: string;

  @ManyToOne(() => RestaurantMenu, (menu) => menu.addOns)
  @JoinColumn({ name: 'menuItemId' })
  menu: RestaurantMenu;
  @Column('numeric')
  menuItemId: number;

  @Column('text')
  addonDescription: string;

  @Column('numeric')
  addonPrice: number;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @DeleteDateColumn({ name: 'deletedat' })
  deletedat: Date;
}
