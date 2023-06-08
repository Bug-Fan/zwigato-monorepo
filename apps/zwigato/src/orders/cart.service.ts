import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddToCartRequestDto } from './dto/request/add.to.cart.request.dto';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import { Cart } from 'src/db/entities/cart.entity';
import { RestaurantMenu } from 'src/db/entities/restaurantMenu.entity';
import { RestaurantMenuAddOns } from 'src/db/entities/restaurantMenuAddOns.entity';
import { CartAddons } from 'src/db/entities/cartAddons.entity';
import { ViewCartResponseDto } from './dto/response/view.cart.response.dto';
import { EditCartQuantityRequestDto } from './dto/request/edit.cart.quantity.request.dto';
import { AddToCartResponseDto } from './dto/response/add.to.cart.response.dto';
import { DeleteItemFromCartResponseDto } from './dto/response/delete.item.from.cart.dto';
import { ClearCartResponseDto } from './dto/response/clear.cart.response.dto';
import { EditCartItemResponseDto } from './dto/response/edit.cart.item.quantity.response.dto';
import { EditCartAddonResponseDto } from './dto/response/edit.cart.addon.response.dto';
import { Coupon } from 'src/db/entities/coupon.entity';
import { OrdersService } from './orders.service';
import {
  CouponResponseData,
  CouponResponseDto,
} from './dto/response/coupon.response.dto';
import { Customer } from 'src/db/entities/customer.entity';
import { ApplyCodeResponseDto } from './dto/response/apply.code.response.dto';
import { UsedCoupons } from 'src/db/entities/usedCoupons.entity';

@Injectable()
export class CartService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}

  async addToCart(
    addToCartRequestDto: AddToCartRequestDto,
    customerId,
  ): Promise<AddToCartResponseDto> {
    const { itemId, itemQuantity, selectedAddons } = addToCartRequestDto;

    try {
      const validItemAndAddons = await this.validateItemAndAddons(
        itemId,
        selectedAddons,
      );

      const validRestaurant = await this.validateRestaurant(itemId, customerId);

      const validCartItem = await this.validateCartItem(customerId, itemId);

      if (validItemAndAddons && validRestaurant.status === true) {
        if (validCartItem) {
          const cartItem = await this.dataSource.manager.create(Cart, {
            quantity: itemQuantity,
            menuItemId: itemId,
            restaurantId: validRestaurant.restaurantId,
            customerId,
          });

          const addToCartTransaction =
            await this.dataSource.manager.transaction(
              async (em: EntityManager) => {
                const itemAdded = await em.insert(Cart, cartItem);

                const addons = selectedAddons.map((addon) =>
                  this.dataSource.manager.create(CartAddons, {
                    menuAddOnID: addon.menuAddonId,
                    cartItemId: itemAdded.identifiers[0].cartItemId,
                    quantity: addon.addonQuantity,
                  }),
                );

                const addonsAdded = await em.insert(CartAddons, addons);

                return true;
              },
            );

          if (addToCartTransaction) {
            return new AddToCartResponseDto(
              false,
              'Item added to cart successfully.',
            );
          } else {
            throw new BadGatewayException();
          }
        } else {
          throw new HttpException('Item already added', 1021, {
            description: 'The item you selected is already in cart.',
          });
        }
      } else {
        throw new HttpException(
          'Item or addon invalid or restaurant inactive',
          1022,
          { description: 'Items or addons not valid or restaurant inactive.' },
        );
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(
          'The item you selected is currently not available.',
        );
      } else if (error.status === 400) {
        throw new BadRequestException(
          'One of the selected addons is not available for the selected menu item.',
        );
      } else if (error.status === 409) {
        throw new ConflictException(
          'You cannot add an item for a different restaurant when items for a restaurant exist in your cart.',
        );
      } else if (error.status === 1021) {
        throw new ConflictException(error.options.description);
      } else if (error.status === 1022) {
        throw new BadRequestException(error.options.description);
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to add item to cart.');
      }
    }
  }

  async viewCart(customerId): Promise<ViewCartResponseDto> {
    try {
      const userCart = await this.dataSource.manager.find(Cart, {
        select: {
          cartItemId: true,
          menu: { itemName: true, MRP: true },
          quantity: true,
          cartAddOns: {
            cartAddonItemId: true,
            quantity: true,
            menuAddOn: { addOnName: true, addonPrice: true },
          },
          couponId: true,
          coupon: { couponCodeName: true },
        },
        relations: {
          cartAddOns: { menuAddOn: true },
          menu: true,
          coupon: true,
        },
        where: { customerId },
      });

      if (userCart.length > 0) {
        const viewCartResponse = this.calculateSubtotal(userCart);
        if (userCart[0].couponId) {
          const discountedPrice = await this.applyCouponCode(
            userCart[0].coupon.couponCodeName,
            customerId,
          );

          return new ViewCartResponseDto(
            false,
            'Cart Data Fetched',
            viewCartResponse.data.subTotal,
            userCart,
            discountedPrice.data.discountedPrice,
          );
        } else {
          return viewCartResponse;
        }
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Please add items to cart.');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to get cart items.');
      }
    }
  }

  async validateCartItem(
    customerId: string,
    menuItemId: number,
  ): Promise<boolean> {
    try {
      const itemExists = await this.dataSource.manager.findOneBy(Cart, {
        menuItemId,
        customerId,
      });

      if (itemExists) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async clearCart(customerId): Promise<ClearCartResponseDto> {
    try {
      const cleared = await this.dataSource.manager.delete(Cart, {
        customerId,
      });
      if (cleared.affected > 0) {
        return new ClearCartResponseDto(false, 'Cart cleared successfully.');
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Your cart is already empty.');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to clear your cart.');
      }
    }
  }

  async validateItemAndAddons(
    itemId: number,
    selectedAddons,
  ): Promise<boolean> {
    try {
      const itemPresent = await this.dataSource.manager.findBy(RestaurantMenu, {
        itemId,
        isAvailable: true,
        isDeleted: false,
      });

      if (itemPresent.length === 1) {
        const existingAddons = await this.dataSource.manager.find(
          RestaurantMenuAddOns,
          {
            select: { menuAddOnId: true },
            where: { menuItemId: itemId, isDeleted: false, isAvailable: true },
          },
        );

        const addonIds = existingAddons.map((addon) => addon.menuAddOnId);
        const validAddons = selectedAddons.find(
          (addon: { menuAddonId: number; }) => !addonIds.includes(addon.menuAddonId),
        );

        if (validAddons === undefined) {
          return true;
        } else {
          throw new BadRequestException();
        }
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }
  }

  async validateRestaurant(itemId: number, customerId: string) {
    try {
      const item = await this.dataSource.manager.findOneBy(RestaurantMenu, {
        itemId,
      });
      const restaurantId = item.restaurantId;

      const valid = await this.dataSource.manager.findBy(Cart, {
        restaurantId: Not(restaurantId),
        customerId,
      });

      if (valid.length > 0) {
        throw new ConflictException();
      } else {
        return { status: true, restaurantId };
      }
    } catch (error) {
      throw error;
    }
  }

  calculateSubtotal(cart: Cart[]): ViewCartResponseDto {
    try {
      let subtotal = 0;

      cart.forEach((cartItem) => {
        let addOnPrice = 0;

        cartItem.cartAddOns.forEach((addOnitem) => {
          addOnPrice += addOnitem.quantity * addOnitem.menuAddOn.addonPrice;
        });

        subtotal += addOnPrice + cartItem.quantity * cartItem.menu.MRP;
      });

      return new ViewCartResponseDto(
        false,
        'Cart data fetched.',
        subtotal,
        cart,
      );
    } catch (e) {
      throw e;
    }
  }

  async removeItemFromCart(
    cartItemId: number,
    customerId: string,
  ): Promise<DeleteItemFromCartResponseDto> {
    try {
      const deleted = await this.dataSource.manager.delete(Cart, {
        cartItemId,
        customerId,
      });
      if (deleted.affected === 1) {
        return new DeleteItemFromCartResponseDto(
          false,
          'Item deleted from cart.',
        );
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(
          'The item you selected to remove is not in the cart.',
        );
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to delete item from cart.');
      }
    }
  }

  async editCartItemQuantity(
    editCartItemQuantityRequestDto: EditCartQuantityRequestDto,
    customerId,
  ): Promise<EditCartItemResponseDto> {
    const { itemId: cartItemId, quantity } = editCartItemQuantityRequestDto;

    try {
      const update = await this.dataSource.manager.update(
        Cart,
        { cartItemId, customerId },
        { quantity },
      );
      if (update.affected === 1) {
        return new EditCartItemResponseDto(
          false,
          'Cart item quantity updated successfully.',
        );
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(
          'The cart item you are trying to update is not available.',
        );
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to update cart item quantity.');
      }
    }
  }

  async editCartAddonQuantity(
    editCartItemQuantityRequestDto: EditCartQuantityRequestDto,
    customerId,
  ): Promise<EditCartAddonResponseDto> {
    const { itemId: cartAddonItemId, quantity } =
      editCartItemQuantityRequestDto;

    try {
      const addonValid = await this.dataSource.manager.find(Cart, {
        relations: { cartAddOns: true },
        where: { customerId, cartAddOns: { cartAddonItemId } },
      });

      if (addonValid.length === 1) {
        const update = await this.dataSource.manager.update(
          CartAddons,
          { cartAddonItemId },
          { quantity },
        );

        if (update.affected === 1) {
          return new EditCartAddonResponseDto(
            false,
            'Cart addon quantity updated successfully.',
          );
        } else {
          throw new BadGatewayException();
        }
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(
          'The cart addon you are trying to update is not available.',
        );
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to update cart addon quantity.');
      }
    }
  }

  async listCoupons(customerId: string): Promise<CouponResponseDto> {
    try {
      const findCustomerInfo = await this.dataSource.manager.findOne(Customer, {
        where: { customerId },
      });

      const monthVal = findCustomerInfo?.monthOrderValue;
      let findCoupons: Coupon[], whereCondition: object | object[];

      if (monthVal >= 3000) {
        whereCondition = { isDeleted: false };
      } else if (monthVal < 3000 && monthVal >= 2000) {
        whereCondition = [
          { couponCategoryId: 2, isDeleted: false },
          { couponCategoryId: 3, isDeleted: false },
          { couponCategoryId: 4, isDeleted: false },
        ];
      } else if (monthVal < 2000 && monthVal >= 1000) {
        whereCondition = [
          { couponCategoryId: 3, isDeleted: false },
          { couponCategoryId: 4, isDeleted: false },
        ];
      } else if (monthVal < 1000 && monthVal >= 100) {
        whereCondition = { couponCategoryId: 4, isDeleted: false };
      } else {
        whereCondition = null;
      }

      if (whereCondition) {
        findCoupons = await this.dataSource.manager.find(Coupon, {
          where: whereCondition,
          relations: { usedCoupon: true, couponCategory: true },
        });

        const eligibleCoupons = findCoupons.map((coupon) => coupon.couponId);

        if (findCoupons.length > 0) {
          const usedCoupons = await this.dataSource.manager.find(UsedCoupons, {
            select: { couponId: true },
            where: { customerId, couponId: In(eligibleCoupons) },
          });

          const usedCouponIds = usedCoupons.map((coupon) => coupon.couponId);
          findCoupons = findCoupons.filter(
            (coupon) => !usedCouponIds.includes(coupon.couponId),
          );

          return new CouponResponseDto(false, 'Coupon fetched', findCoupons);
        }
      } else {
        throw new HttpException('not found any coupons', 1049, {
          description: 'No coupons are available for you.',
        });
      }
    } catch (error) {
      if (error.status === 1049) {
        throw new NotFoundException(error.options.description);
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to get coupons');
      }
    }
  }

  async applyCouponCode(
    couponCode: string,
    customerId,
  ): Promise<ApplyCodeResponseDto> {
    try {
      const validCoupons = await this.listCoupons(customerId);

      const couponValid: CouponResponseData = validCoupons.data.find(
        (coupon) => coupon.couponCodeName === couponCode,
      );

      if (couponValid) {
        const userCart = await this.dataSource.manager.find(Cart, {
          where: { customerId },
          relations: {
            menu: true,
            cartAddOns: { menuAddOn: true },
            coupon: true,
          },
        });

        if (userCart.length > 0) {
          const { couponId, minOrderValue, discountPercent } = couponValid;
          const subTotal = this.calculateSubtotal(userCart).data.subTotal;

          if (subTotal >= minOrderValue) {
            const discountedPrice =
              subTotal - subTotal * discountPercent * 0.01;

            const insertCoupon = await this.dataSource.manager.update(
              Cart,
              { customerId },
              { couponId },
            );
            if (insertCoupon.affected >= 1) {
              return new ApplyCodeResponseDto(
                false,
                'Coupon applied successfully.',
                subTotal,
                discountedPrice,
              );
            }
          } else {
            throw new HttpException('Subtotal Less Than MinOrderValue', 1053, {
              description:
                'Your subtotal value is less than Minimum order value for the coupon, please try another coupon or add more items in the cart.',
            });
          }
        } else {
          throw new HttpException('Cart Empty', 1052, {
            description: "Your cart is empty, so you can't add any coupon",
          });
        }
      } else {
        throw new HttpException('Invalid Coupon', 1051, {
          description: 'This coupon is not available for you.',
        });
      }
    } catch (error) {
      if (
        error.status === 1051 ||
        error.status === 1052 ||
        error.status === 1053
      ) {
        throw new BadRequestException(error.options.description);
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to apply coupon to your cart.');
      }
    }
  }
}
