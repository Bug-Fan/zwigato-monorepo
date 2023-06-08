import { Test } from '@nestjs/testing';
import { CartService } from './cart.service';
import { AddToCartRequestDto } from './dto/request/add.to.cart.request.dto';
import { AddToCartResponseDto } from './dto/response/add.to.cart.response.dto';
import { DataSource, DeepPartial } from 'typeorm';
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ViewCartResponseDto } from './dto/response/view.cart.response.dto';
import { plainToInstance } from 'class-transformer';
import { ClearCartResponseDto } from './dto/response/clear.cart.response.dto';
import exp from 'constants';
import { DeleteItemFromCartResponseDto } from './dto/response/delete.item.from.cart.dto';
import { EditCartItemResponseDto } from './dto/response/edit.cart.item.quantity.response.dto';
import { EditCartAddonResponseDto } from './dto/response/edit.cart.addon.response.dto';
import { CouponResponseDto } from './dto/response/coupon.response.dto';
import { ApplyCodeResponseDto } from './dto/response/apply.code.response.dto';
import { Cart } from '../db/entities/cart.entity';
import { FoodType, RestaurantMenu } from '../db/entities/restaurantMenu.entity';
import { Coupon } from '../db/entities/coupon.entity';
import { RestaurantMenuAddOns } from '../db/entities/restaurantMenuAddOns.entity';
import { CartAddons } from '../db/entities/cartAddons.entity';

describe('Cart Test suite', () => {
  let Service: CartService, dataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: 'DataSource',
          useValue: {
            manager: {
              find: jest.fn(),
              create: jest.fn(),
              transaction: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              findOne: jest.fn(),
              findOneBy: jest.fn(),
              findBy: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    Service = module.get<CartService>(CartService);
    dataSource = module.get<DataSource>('DataSource');
  });

  describe('addToCart', () => {
    const mockAddToCartRequestDto: AddToCartRequestDto = {
        itemId: 1,
        itemQuantity: 3,
        selectedAddons: [{ menuAddonId: 2, addonQuantity: 4 }],
      },
      mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    it('should add item to cart', () => {
      Service.validateItemAndAddons = Service.validateCartItem = jest
        .fn()
        .mockResolvedValue(true);

      Service.validateRestaurant = jest.fn().mockResolvedValue({
        restaurantId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
        status: true,
      });

      dataSource.manager.transaction.mockResolvedValue(true);
      return expect(
        Service.addToCart(mockAddToCartRequestDto, mockCustomerId),
      ).resolves.toEqual({
        isError: false,
        message: 'Item added to cart successfully.',
      });
    });

    it('should throw not found exception if item not available', () => {
      Service.validateItemAndAddons = jest
        .fn()
        .mockRejectedValue(new NotFoundException());

      return expect(
        Service.addToCart(mockAddToCartRequestDto, mockCustomerId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad request exception if any item addon not available', () => {
      Service.validateItemAndAddons = jest
        .fn()
        .mockRejectedValue(new BadRequestException());

      return expect(
        Service.addToCart(mockAddToCartRequestDto, mockCustomerId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad request exception if item is unavailable', () => {
      Service.validateItemAndAddons = Service.validateCartItem = jest
        .fn()
        .mockResolvedValue(true);

      Service.validateRestaurant = jest.fn().mockResolvedValue({
        status: false,
      });

      return expect(
        Service.addToCart(mockAddToCartRequestDto, mockCustomerId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw conflict exception if cart contains item other than selected restaurant item', () => {
      Service.validateItemAndAddons = jest.fn().mockResolvedValue(true);
      Service.validateCartItem = jest.fn().mockResolvedValue(true);
      Service.validateRestaurant = jest
        .fn()
        .mockRejectedValue(new ConflictException());

      return expect(
        Service.addToCart(mockAddToCartRequestDto, mockCustomerId),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw conflict exception if item exists in cart', () => {
      Service.validateItemAndAddons = jest.fn().mockResolvedValue(true);
      Service.validateRestaurant = jest
        .fn()
        .mockResolvedValue({ status: true, restaurantId: 'resId' });
      Service.validateCartItem = jest.fn().mockResolvedValue(false);

      return expect(
        Service.addToCart(mockAddToCartRequestDto, mockCustomerId),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw exception transaction fails', () => {
      Service.validateItemAndAddons = jest.fn().mockResolvedValue(true);
      Service.validateCartItem = jest.fn().mockResolvedValue(true);
      Service.validateRestaurant = jest.fn().mockResolvedValue({
        restaurantId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
        status: true,
      });

      dataSource.manager.transaction.mockResolvedValue();
      return expect(
        Service.addToCart(mockAddToCartRequestDto, mockCustomerId),
      ).rejects.toThrow(new BadGatewayException('Unable to add item to cart.'));
    });
  });

  describe('viewCart', () => {
    const mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    it('should return cart details dto', () => {
      dataSource.manager.find.mockResolvedValue([
        {
          cartItemId: 135,
          quantity: '7',
          couponId: null,
          cartAddOns: [],
          menu: { itemName: 'Bhaji Pav', MRP: '120' },
          coupon: null,
        },
      ]);

      Service.calculateSubtotal = jest.fn().mockReturnValue({
        isError: false,
        message: 'Cart data fetched.',
        data: {
          subTotal: 840,
          discountedPrice: 840,
          cartItems: [
            {
              cartItemId: 135,
              itemName: 'Bhaji Pav',
              itemQuantity: '7',
              itemPrice: '120',
              itemCost: 840,
              itemAddons: [],
              itemSubtotal: 840,
            },
          ],
        },
      });

      return expect(Service.viewCart(mockCustomerId)).resolves.toEqual({
        isError: false,
        message: 'Cart data fetched.',
        data: {
          subTotal: 840,
          discountedPrice: 840,
          cartItems: [
            {
              cartItemId: 135,
              itemName: 'Bhaji Pav',
              itemQuantity: '7',
              itemPrice: '120',
              itemCost: 840,
              itemAddons: [],
              itemSubtotal: 840,
            },
          ],
        },
      });
    });

    it('should return cart details dto with discounted price', () => {
      dataSource.manager.find.mockResolvedValue([
        {
          cartItemId: 135,
          quantity: '7',
          couponId: 2,
          cartAddOns: [],
          menu: { itemName: 'Bhaji Pav', MRP: '120' },
          coupon: { couponCodeName: 'Coupon' },
        },
      ]);

      Service.calculateSubtotal = jest.fn().mockReturnValue({
        isError: false,
        message: 'Cart data fetched.',
        data: {
          subTotal: 840,
          discountedPrice: 840,
          cartItems: [
            {
              cartItemId: 135,
              itemName: 'Bhaji Pav',
              itemQuantity: '7',
              itemPrice: '120',
              itemCost: 840,
              itemAddons: [],
              itemSubtotal: 840,
            },
          ],
        },
      });

      Service.applyCouponCode = jest.fn().mockResolvedValue({
        isError: false,
        message: 'Cart data fetched.',
        data: {
          subTotal: 840,
          discountedPrice: 840,
          cartItems: [
            {
              cartItemId: 135,
              itemName: 'Bhaji Pav',
              itemQuantity: '7',
              itemPrice: '120',
              itemCost: 840,
              itemAddons: [],
              itemSubtotal: 840,
            },
          ],
        },
      });

      return expect(Service.viewCart(mockCustomerId)).resolves.toEqual({
        isError: false,
        message: 'Cart Data Fetched',
        data: {
          subTotal: 840,
          discountedPrice: 840,
          couponCodeName: 'Coupon',
          cartItems: [
            {
              cartItemId: 135,
              itemName: 'Bhaji Pav',
              itemQuantity: '7',
              itemPrice: '120',
              itemCost: 840,
              itemAddons: [],
              itemSubtotal: 840,
            },
          ],
        },
      });
    });

    it('should throw not found exception if cart is empty', () => {
      dataSource.manager.find.mockResolvedValue([]);

      return expect(Service.viewCart(mockCustomerId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.find.mockRejectedValue({ status: 502 });

      return expect(Service.viewCart(mockCustomerId)).rejects.toThrow(
        BadGatewayException,
      );
    });
  });

  describe('clearCart', () => {
    const mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    it('should return response that cart is cleared', () => {
      dataSource.manager.delete.mockResolvedValue({ affected: 1 });

      return expect(Service.clearCart(mockCustomerId)).resolves.toEqual({
        isError: false,
        message: 'Cart cleared successfully.',
      });
    });

    it('should throw not found exception if cart is empty', () => {
      dataSource.manager.delete.mockResolvedValue({ affected: 0 });

      return expect(Service.clearCart(mockCustomerId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.delete.mockRejectedValue({ status: 502 });

      return expect(Service.clearCart(mockCustomerId)).rejects.toThrow(
        BadGatewayException,
      );
    });
  });

  describe('removeItemFromCart', () => {
    const mockCartItemId = 1,
      mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    it('should delete cart item from cart', () => {
      dataSource.manager.delete.mockResolvedValue({ affected: 1 });

      return expect(
        Service.removeItemFromCart(mockCartItemId, mockCustomerId),
      ).resolves.toEqual({
        isError: false,
        message: 'Item deleted from cart.',
      });
    });

    it('should throw not found exception if cart item is not found', () => {
      dataSource.manager.delete.mockResolvedValue({ affected: 0 });

      return expect(
        Service.removeItemFromCart(mockCartItemId, mockCustomerId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.delete.mockRejectedValue({ status: 502 });

      return expect(
        Service.removeItemFromCart(mockCartItemId, mockCustomerId),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('editCartItemQuantity', () => {
    const mockEditcartItemQuantityRequestDto = {
        itemId: 1,
        quantity: 2,
      },
      mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    it('should edit cart item quantity', () => {
      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      return expect(
        Service.editCartItemQuantity(
          mockEditcartItemQuantityRequestDto,
          mockCustomerId,
        ),
      ).resolves.toEqual({
        isError: false,
        message: 'Cart item quantity updated successfully.',
      });
    });

    it('should throw not found exception if cart item is not found', () => {
      dataSource.manager.update.mockResolvedValue({ affected: 0 });

      return expect(
        Service.editCartItemQuantity(
          mockEditcartItemQuantityRequestDto,
          mockCustomerId,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.update.mockRejectedValue({ status: 502 });

      return expect(
        Service.editCartItemQuantity(
          mockEditcartItemQuantityRequestDto,
          mockCustomerId,
        ),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('editCartAddonQuantity', () => {
    const mockEditcartAddonQuantityRequestDto = {
        itemId: 1,
        quantity: 2,
      },
      mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    it('should edit cart addon quantity', () => {
      dataSource.manager.find.mockResolvedValue(['addon']);
      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      return expect(
        Service.editCartAddonQuantity(
          mockEditcartAddonQuantityRequestDto,
          mockCustomerId,
        ),
      ).resolves.toEqual({
        isError: false,
        message: 'Cart addon quantity updated successfully.',
      });
    });

    it('should throw not found exception if cart addon is not found', () => {
      dataSource.manager.find.mockResolvedValue([]);

      return expect(
        Service.editCartAddonQuantity(
          mockEditcartAddonQuantityRequestDto,
          mockCustomerId,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad gateway exception if update fails', () => {
      dataSource.manager.find.mockResolvedValue(['addon']);
      dataSource.manager.update.mockResolvedValue({ affected: 0 });

      return expect(
        Service.editCartAddonQuantity(
          mockEditcartAddonQuantityRequestDto,
          mockCustomerId,
        ),
      ).rejects.toThrow(BadGatewayException);
    });

    it('should throw bad gateway exception if any query fails', () => {
      dataSource.manager.update.mockRejectedValue({ status: 502 });

      return expect(
        Service.editCartAddonQuantity(
          mockEditcartAddonQuantityRequestDto,
          mockCustomerId,
        ),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('listCoupons', () => {
    const mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    it('should list coupons', () => {
      dataSource.manager.findOne.mockResolvedValue({ monthOrderValue: 1122 });

      dataSource.manager.find
        .mockResolvedValueOnce([
          {
            couponId: 1,
            couponCodeName: 'AK47',
            discountPercent: '20',
            MinOrderValue: '500',
            expireDate: '2023-04-19T06:30:00.000Z',
            couponCategory: {
              categoryName: 'SILVER',
            },
          },
          {
            couponId: 2,
            couponCodeName: 'AK476',
            discountPercent: '20',
            MinOrderValue: '500',
            expireDate: '2023-04-19T06:30:00.000Z',
            couponCategory: {
              categoryName: 'SILVER',
            },
          },
        ])
        .mockResolvedValueOnce([]);

      return expect(Service.listCoupons(mockCustomerId)).resolves.toEqual({
        isError: false,
        message: 'Coupon fetched',
        data: [
          {
            couponId: 1,
            couponCodeName: 'AK47',
            categoryName: 'SILVER',
            expiryDate: '2023-04-19T06:30:00.000Z',
            minOrderValue: '500',
            discountPercent: '20',
          },
          {
            couponId: 2,
            couponCodeName: 'AK476',
            categoryName: 'SILVER',
            expiryDate: '2023-04-19T06:30:00.000Z',
            minOrderValue: '500',
            discountPercent: '20',
          },
        ],
      });
    });

    it('should throw not found exception if no coupons are found', () => {
      dataSource.manager.findOne.mockResolvedValue({ monthOrderValue: 0 });

      return expect(Service.listCoupons(mockCustomerId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw bad gateway exception if any query fails', () => {
      dataSource.manager.findOne.mockRejectedValue({ status: 502 });

      return expect(Service.listCoupons(mockCustomerId)).rejects.toThrow(
        BadGatewayException,
      );
    });
  });

  describe('applyCouponCode', () => {
    const mockCouponCode = 'Coupon2',
      mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    it('should apply coupon', () => {
      Service.listCoupons = jest.fn().mockResolvedValue({
        data: [
          {
            couponCodeName: 'Coupon1',
            couponId: 1,
            minOrderValue: 1000,
            discountPercent: 10,
          },
          {
            couponCodeName: 'Coupon2',
            couponId: 2,
            minOrderValue: 200,
            discountPercent: 20,
          },
        ],
      });

      dataSource.manager.find.mockResolvedValue([{ cartItem: 'cart' }]);

      Service.calculateSubtotal = jest
        .fn()
        .mockReturnValue({ data: { subTotal: 500 } });

      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      return expect(
        Service.applyCouponCode(mockCouponCode, mockCustomerId),
      ).resolves.toEqual({
        isError: false,
        message: 'Coupon applied successfully.',
        data: {
          subTotal: 500,
          discountedPrice: 400,
        },
      });
    });

    it('should throw bad request exception if user is not eligible for coupon', () => {
      Service.listCoupons = jest.fn().mockResolvedValue({
        data: [],
      });

      return expect(
        Service.applyCouponCode(mockCouponCode, mockCustomerId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad request exception if cart is empty', () => {
      Service.listCoupons = jest.fn().mockResolvedValue({
        data: [
          {
            couponCodeName: 'Coupon1',
            couponId: 1,
            minOrderValue: 1000,
            discountPercent: 10,
          },
          {
            couponCodeName: 'Coupon2',
            couponId: 2,
            minOrderValue: 200,
            discountPercent: 20,
          },
        ],
      });

      dataSource.manager.find.mockResolvedValue([]);

      return expect(
        Service.applyCouponCode(mockCouponCode, mockCustomerId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad request exception if subtotal is less than minimum order value', () => {
      Service.listCoupons = jest.fn().mockResolvedValue({
        data: [
          {
            couponCodeName: 'Coupon1',
            couponId: 1,
            minOrderValue: 1000,
            discountPercent: 10,
          },
          {
            couponCodeName: 'Coupon2',
            couponId: 2,
            minOrderValue: 200,
            discountPercent: 20,
          },
        ],
      });

      dataSource.manager.find.mockResolvedValue([{ cartItem: 'cart' }]);

      Service.calculateSubtotal = jest
        .fn()
        .mockReturnValue({ data: { subTotal: 100 } });

      return expect(
        Service.applyCouponCode(mockCouponCode, mockCustomerId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad gateway exception if query fails', () => {
      Service.listCoupons = jest.fn().mockResolvedValue({
        data: [
          {
            couponCodeName: 'Coupon1',
            couponId: 1,
            minOrderValue: 1000,
            discountPercent: 10,
          },
          {
            couponCodeName: 'Coupon2',
            couponId: 2,
            minOrderValue: 200,
            discountPercent: 20,
          },
        ],
      });

      dataSource.manager.find.mockResolvedValue([{ cartItem: 'CartItem' }]);

      Service.calculateSubtotal = jest
        .fn()
        .mockReturnValue({ data: { subTotal: 500 } });

      dataSource.manager.update.mockRejectedValue({ status: 502 });

      return expect(
        Service.applyCouponCode(mockCouponCode, mockCustomerId),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('validateCartItem', () => {
    const mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
      mockMenuItemId = 1;

    it('should return false if menu item exists in cart', () => {
      dataSource.manager.findOneBy.mockResolvedValue('cartItem');

      return expect(
        Service.validateCartItem(mockCustomerId, mockMenuItemId),
      ).resolves.toBe(false);
    });

    it('should return true if menu item does not exist in cart', () => {
      dataSource.manager.findOneBy.mockResolvedValue();

      return expect(
        Service.validateCartItem(mockCustomerId, mockMenuItemId),
      ).resolves.toBe(true);
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.findOneBy.mockRejectedValue();

      return expect(
        Service.validateCartItem(mockCustomerId, mockMenuItemId),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('validateItemAndAddons', () => {
    const mockItemId = 1,
      mockSelectedAddons = [{ menuAddonId: 2, addonQuantity: 4 }];

    it('should return true if items and addons are valid and available', () => {
      dataSource.manager.findBy.mockResolvedValue(['menuItem']);
      dataSource.manager.find.mockResolvedValue([
        { menuAddOnId: 2, addonQuantity: 4 },
      ]);

      return expect(
        Service.validateItemAndAddons(mockItemId, mockSelectedAddons),
      ).resolves.toBe(true);
    });

    it('should throw not found exception if menu item is not available', () => {
      dataSource.manager.findBy.mockResolvedValue([]);

      return expect(
        Service.validateItemAndAddons(mockItemId, mockSelectedAddons),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad requst exception if any one of selected addons is not available or valid', () => {
      dataSource.manager.findBy.mockResolvedValue(['menuItem']);
      dataSource.manager.find.mockResolvedValue([]);

      return expect(
        Service.validateItemAndAddons(mockItemId, mockSelectedAddons),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateRestaurant', () => {
    const mockCustomerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
      mockItemId = 1;

    it('should return restaurant Id if it is active and is in user cart', () => {
      dataSource.manager.findOneBy.mockResolvedValue({ restaurantId: 1 });

      dataSource.manager.findBy.mockResolvedValue([]);

      return expect(
        Service.validateRestaurant(mockItemId, mockCustomerId),
      ).resolves.toEqual({ status: true, restaurantId: 1 });
    });

    it('should throw conflict exception if user cart contains items that are not of specified restaurant', () => {
      dataSource.manager.findOneBy.mockResolvedValue({ restaurantId: 1 });

      dataSource.manager.findBy.mockResolvedValue([{ cartItem: 'cartItem1' }]);

      return expect(
        Service.validateRestaurant(mockItemId, mockCustomerId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('calculateSubtotal', () => {
    const mockUserCart: Cart[] = [
      <Cart>{
        cartItemId: 139,
        quantity: 4,
        cartAddOns: <CartAddons[]>[
          {
            cartAddonItemId: 137,
            quantity: 1,
            menuAddOn: <RestaurantMenuAddOns>{
              addOnName: 'cachumber',
              addonPrice: 20,
            },
          },
        ],
        menu: <RestaurantMenu>{
          itemName: 'Bhaji Pav',
          MRP: 120,
        },
      },
    ];

    it('should return subtotal', () => {
      return expect(Service.calculateSubtotal(mockUserCart)).toEqual({
        isError: false,
        message: 'Cart data fetched.',
        data: {
          subTotal: 500,
          discountedPrice: 500,
          cartItems: [
            {
              cartItemId: 139,
              itemName: 'Bhaji Pav',
              itemQuantity: 4,
              itemPrice: 120,
              itemCost: 480,
              itemAddons: [
                {
                  cartItemAddonId: 137,
                  addonName: 'cachumber',
                  addonQuantity: 1,
                  addonPrice: 20,
                  addonCost: 20,
                },
              ],
              itemSubtotal: 500,
            },
          ],
        },
      });
    });
  });
});
