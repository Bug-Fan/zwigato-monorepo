import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderHistoryResponseDto } from './dto/response/order.history.response.dto';
import { Address } from 'src/db/entities/address.entitiy';
import { Cart } from 'src/db/entities/cart.entity';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { DataSource, EntityManager, In, IsNull, Not } from 'typeorm';

import { GeoCoddingService } from 'src/geocode.service';
import { AllCutConstants } from 'src/constants/all.cut.constants';
import { Order, OrderStatus } from 'src/db/entities/order.entity';
import { OrderItems } from 'src/db/entities/orderItems.entity';
import { OrderAddOns } from 'src/db/entities/orderAddOns.entity';
import { OrderPlacedResponseDto } from './dto/response/order.placed.response.dto';
import { RatingRequestDto } from './dto/request/ratings.request.dto';
import { OrderRatingRequestDto } from './dto/request/orderRating.request.dto';
import { RestaurantMenu } from 'src/db/entities/restaurantMenu.entity';
import { CartService } from './cart.service';
import { OrderPayResponseDto } from './dto/response/order.pay.response.dto';
import { OrderItemRatingResponseDto } from './dto/response/order.item.rating.reponse.dto';
import { OrderRatingResponseDto } from './dto/response/order.rating.response.dto';
import { OrderCancelResponseDto } from './dto/response/order.cancel.response.dto';
import {
  EmailResponse,
  EmailService,
  EmailSubjects,
} from 'src/email/email.service';
import { Coupon } from 'src/db/entities/coupon.entity';
import { Customer } from 'src/db/entities/customer.entity';
import { CouponResponseDto } from './dto/response/coupon.response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private geocodeService: GeoCoddingService,
    private cartService: CartService,
    private emailService: EmailService,
  ) {}

  async getOrderHistory(customerId): Promise<OrderHistoryResponseDto> {
    try {
      const orderHistory = await this.dataSource.manager.find(Order, {
        select: {
          orderId: true,
          restaurantId: true,
          deliveryAddress: true,
          deliveryCharges: true,
          discountedPrice: true,
          totalAmount: true,
          prepareTime: true,
          orderStatus: true,
          rejectionReason: true,
          deliveredOn: true,
          orderPlacedOn: true,
          deliveryRatings: true,
          deliveryRemarks: true,
          subTotal: true,
          orderItems: {
            itemPrice: true,
            itemId: true,
            itemName: true,
            itemTotalAmount: true,
            quantity: true,

            orderAddOn: {
              quantity: true,
              totalAddonPrice: true,
              orderAddonName: true,
              orderAddOnPrice: true,
              orderItems: { itemName: true, quantity: true, remarks: true },
            },
          },
          deliveryAgent: { agentName: true },
          coupon: { couponCodeName: true },
        },
        where: {
          customerId,
        },
        relations: {
          orderItems: { orderAddOn: true },
          deliveryAgent: true,
          coupon: true,
        },
        order: { orderPlacedOn: 'DESC' },
      });

      if (orderHistory.length > 0) {
        return new OrderHistoryResponseDto(
          false,
          'Order History fetched',
          orderHistory,
        );
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('You have not placed any orders.');
      } else {
        console.log(error);
        throw new BadGatewayException();
      }
    }
  }

  async placeOrder(
    customerId: string,
    addressId: number,
  ): Promise<OrderPlacedResponseDto> {
    // const { addressId } = placeOrderDto;
    try {
      const validAddress = await this.validateAddress(addressId, customerId);

      const userCart = await this.dataSource.manager.find(Cart, {
        where: { customerId },
      });

      if (validAddress) {
        if (userCart.length > 0) {
          const validRestaurant = await this.validateRestaurant(
            userCart[0].restaurantId,
          );

          if (validRestaurant) {
            const validCart = await this.validateCart(customerId);

            if (validCart) {
              const distance = await this.calculateDistance(
                addressId,
                customerId,
                userCart[0].restaurantId,
              );

              if (distance >= 0) {
                const order = await this.createOrder(
                  //add dicount percent
                  customerId,
                  addressId,
                  userCart[0].restaurantId,
                  distance,
                );

                if (order.length > 0) {
                  return new OrderPlacedResponseDto(
                    false,
                    'You can now got to payment.',
                    order,
                  );
                }
              } else {
                throw new HttpException('Address not in range', 1006, {
                  description:
                    'We do not deliver orders if you are more than 10 km far than restaurant.',
                });
              }
            }
          } else {
            throw new HttpException('RestaurantUnavailable', 1003, {
              description:
                'The restaurant you selected is currently not accepting orders at the moment.',
            });
          }
        } else {
          throw new HttpException('CartEmpty', 1002, {
            description:
              'Your cart is empty. Add items to cart to place an order.',
          });
        }
      } else {
        throw new HttpException('AddressInvalid', 1001, {
          description: 'The address you selected is not available.',
        });
      }
    } catch (error) {
      if (error.status === 1001) {
        throw new NotFoundException(error.options.description);
      } else if (
        error.status === 1002 ||
        error.status === 1003 ||
        error.status === 1004 ||
        error.status === 1005 ||
        error.status === 1006
      ) {
        throw new BadRequestException(error.options.description);
      } else if (error.status === 1061) {
        throw new BadGatewayException(error.options.description);
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to Place order.');
      }
    }
  }

  async validateAddress(addressId, customerId): Promise<boolean> {
    try {
      const addressAvailable = await this.dataSource.manager.findOneBy(
        Address,
        { customerId, addressId },
      );

      if (addressAvailable) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      throw new BadGatewayException();
    }
  }

  async validateRestaurant(restaurantId): Promise<boolean> {
    try {
      const restaurantAvailable = await this.dataSource.manager.findOneBy(
        Restaurant,
        { restaurantId, isActive: true, isDeleted: false },
      );
      if (restaurantAvailable) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      throw new BadGatewayException();
    }
  }

  async validateCart(customerId: string): Promise<boolean> {
    try {
      const validItems = await this.dataSource.manager.findAndCount(Cart, {
        relations: { menu: true },
        where: { customerId, menu: { isAvailable: false } },
      });
      console.log(validItems);
      if (validItems[1] === 0) {
        const validAddons = await this.dataSource.manager.findAndCount(Cart, {
          relations: { cartAddOns: { menuAddOn: true } },
          where: {
            customerId,
            cartAddOns: { menuAddOn: { isAvailable: false } },
          },
        });

        if (validAddons[1] === 0) {
          return true;
        } else {
          throw new HttpException('Addon', 1005, {
            description: `The Addons: are not available at the moment. Hence we are unable to place order.`,
          });
        }
      } else {
        throw new HttpException('Item', 1004, {
          description: `The Items: are not available at the moment. Hence we are unable to place order.`,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async calculateDistance(
    addressId: number,
    customerId,
    restaurantId,
  ): Promise<number> {
    try {
      const userCoordinates = await this.dataSource.manager.findOneBy(Address, {
        addressId,
        customerId,
      });

      const restaurantCoordinates = await this.dataSource.manager.findOneBy(
        Restaurant,
        { restaurantId },
      );

      const { addressLatitude, addressLongitude } = userCoordinates;
      const { restaurantLatitude, restaurantLongitude } = restaurantCoordinates;
      const distance = await this.geocodeService.findDistance(
        addressLatitude,
        addressLongitude,
        restaurantLatitude,
        restaurantLongitude,
      );

      if (distance <= 10) {
        return distance;
      } else {
        return -1;
      }
    } catch (error) {
      throw new HttpException('Distance not working', 1061, {
        description:
          'We are facing issues looking for delivery boys. Please try again later.',
      });
    }
  }

  async trackOrder(
    customerId: string,
    orderId: string,
  ): Promise<OrderHistoryResponseDto> {
    try {
      const trackOrderOfCustomer = await this.dataSource.manager.find(Order, {
        select: {
          orderPlacedOn: true,
          subTotal: true,
          prepareTime: true,
          discountedPrice: true,
          orderStatus: true,
          deliveryAddress: true,
          rejectionReason: true,
          totalAmount: true,
          orderItems: {
            itemId: true,
            itemName: true,
            quantity: true,
            orderAddOn: { orderAddonName: true, quantity: true },
          },
          deliveryAgent: {
            agentName: true,
            agentLatitude: true,
            agentLongitude: true,
            agentPhone: true,
          },
          coupon: { couponCodeName: true },
        },
        where: {
          customerId,
          orderId,
        },

        relations: {
          orderItems: { orderAddOn: true },
          deliveryAgent: true,
          coupon: true,
        },
      });
      if (trackOrderOfCustomer.length > 0) {
        return new OrderHistoryResponseDto(
          false,
          'Order Data fetched',
          trackOrderOfCustomer,
        );
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Order not found.');
      } else {
        console.log(error);
        throw new BadGatewayException();
      }
    }
  }

  async createOrder(
    customerId,
    addressId,
    restaurantId,
    distance,
  ): Promise<string> {
    try {
      const orderTransaction = await this.dataSource.manager.transaction(
        async (em: EntityManager) => {
          const cart: Cart[] = await em.find(Cart, {
            select: {
              menu: { itemId: true, itemName: true, MRP: true },
              quantity: true,
              cartAddOns: {
                menuAddOn: { addOnName: true, addonPrice: true },
                quantity: true,
              },
              couponId: true,
              coupon: { couponCodeName: true },
            },
            relations: {
              cartAddOns: { menuAddOn: true },
              menu: true,
              coupon: true,
            },
            where: {
              customerId,
              customer: { address: { addressId } },
            },
          });

          const subtotalCalculations = await this.cartService.calculateSubtotal(
            cart,
          );
          const { subTotal, cartItems } = subtotalCalculations.data;
          const sgst = subTotal * AllCutConstants.sgst;
          const cgst = subTotal * AllCutConstants.cgst;
          const deliveryCharges = distance * 10;
          const deliveryAgentProfit =
            deliveryCharges * AllCutConstants.deliveryAgentCut;
          const restaurantProfit = subTotal * AllCutConstants.restaurantCut;
          let platformProfit =
            subTotal * AllCutConstants.platformSubtotalCut +
            deliveryCharges * AllCutConstants.platformDeliveryCut;
          const couponCode = cart[0].coupon?.couponCodeName;

          const discountedPrice = couponCode
            ? (await this.cartService.applyCouponCode(couponCode, customerId))
                .data.discountedPrice
            : subTotal;
          const provideddDiscount = subTotal - discountedPrice;
          platformProfit = platformProfit - provideddDiscount;
          const totalAmount = discountedPrice + cgst + sgst + deliveryCharges;

          const address = await this.dataSource.manager.findOneBy(Address, {
            addressId,
          });
          const {
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            addressLatitude,
            addressLongitude,
          } = address;
          const addressLineval2 =
            addressLine2 === null ? '' : ' ' + addressLine2 + ',';
          const deliveryAddress = `${addressLine1},${addressLineval2} ${city}, ${pincode}, ${state}`;

          const order = this.dataSource.manager.create(Order, {
            restaurantId,
            customerId,
            deliveryAddress,
            subTotal,
            sgst,
            cgst,
            totalAmount,
            deliveryCharges,
            deliveryAgentProfit,
            resaturantProfit: restaurantProfit,
            platformProfit,
            addressLatitude,
            addressLongitude,
            discountedPrice,
            couponId: cart[0].couponId,
          });

          const orderCreated = await this.dataSource.manager.insert(
            Order,
            order,
          );

          const orderId = orderCreated.identifiers[0].orderId;

          const orderItems = cartItems.map(async (cartItem) => {
            const item = em.create(OrderItems, {
              orderId,
              itemId: cartItem.itemId,
              itemName: cartItem.itemName,
              quantity: cartItem.itemQuantity,
              itemTotalAmount: cartItem.itemSubtotal,
              itemPrice: cartItem.itemPrice,
            });

            const orderItemsCreated = await em.save(OrderItems, item);
            const orderItemId = orderItemsCreated.orderItemId;

            const addOns = cartItem.itemAddons.map((cartItemAddOn) => {
              return em.create(OrderAddOns, {
                orderItemId,
                orderAddonName: cartItemAddOn.addonName,
                orderAddOnPrice: cartItemAddOn.addonPrice,
                quantity: cartItemAddOn.addonQuantity,
                totalAddonPrice: cartItemAddOn.addonCost,
              });
            });
            await this.dataSource.manager.save(OrderAddOns, addOns);
          });

          return orderCreated.identifiers[0].orderId;
        },
      );
      return orderTransaction;
    } catch (error) {
      console.log(error);
      throw new BadGatewayException();
    }
  }

  async payForOrder(orderId, customerId): Promise<OrderPayResponseDto> {
    try {
      const paidTransaction = await this.dataSource.manager.transaction(
        async (em: EntityManager) => {
          const paid = await em.update(
            Order,
            {
              orderId,
              customerId,
              orderStatus: OrderStatus.PENDING,
            },
            { orderStatus: OrderStatus.PAID },
          );

          const clearedCart = em.delete(Cart, { customerId });

          if (paid.affected > 0) {
            return true;
          } else {
            return false;
          }
        },
      );
      if (paidTransaction) {
        const restoId = await this.dataSource.manager.findOne(Order, {
          where: { customerId, orderId },
        });
        const findMail = await this.dataSource.manager.findOne(Restaurant, {
          where: { restaurantId: restoId.restaurantId },
        });
        const restoMail = findMail.restaurantEmail;
        const timer = setTimeout(() => this.cancelOrder(orderId), 180000);
        this.emailService.send({
          toEmail: restoMail,
          subject: EmailSubjects.ORDER_SUCCESS,
          responseHBS: EmailResponse.ORDER_SUCCESS,
          customObject: {
            orderId,
            name: findMail.restaurantName,
          },
        });

        return new OrderPayResponseDto(
          false,
          'Order placed and payment complete.',
        );
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException('You already paid for order.');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to pay for order.');
      }
    }
  }

  async ratingForItem(
    customerId: string,
    orderId: string,
    ratingReqDto: RatingRequestDto,
  ): Promise<OrderItemRatingResponseDto> {
    const { rating, remarks, itemId } = ratingReqDto;
    try {
      const findOrderDetails = await this.dataSource.manager.find(Order, {
        where: {
          customerId,
          orderId,
          orderItems: { itemId },
          orderStatus: OrderStatus.DELIVERED,
        },
        relations: { orderItems: { orderAddOn: true } },
      });

      if (findOrderDetails.length > 0) {
        if (findOrderDetails[0].orderItems[0].rating === null) {
          // console.log(findOrderDetails[0].orderItems[0].rating, 'hello');
          const customerRating = rating;
          const findAvgRating = await this.dataSource.manager.findOne(
            RestaurantMenu,
            { where: { itemId } },
          );
          let avgrate = findAvgRating.ratingAVG;
          const orderItemCount = await this.dataSource.manager.find(
            OrderItems,
            {
              where: { itemId, rating: Not(IsNull()) },
            },
          );
          const count = orderItemCount.length;
          if (avgrate != null) {
            // console.log(avgrate, count, customerRating);
            avgrate = (+avgrate * +count + +customerRating) / (+count + 1);
            // console.log(avgrate, count);
            const updateRating = await this.dataSource.manager.update(
              OrderItems,
              { orderId, itemId },
              { rating: customerRating, remarks },
            );
            const updateRatinginItem = await this.dataSource.manager.update(
              RestaurantMenu,
              { itemId },
              { ratingAVG: avgrate },
            );

            return new OrderItemRatingResponseDto(
              false,
              'Your feedback is updated, thanks for rate',
            );
          } else {
            const updateRating = await this.dataSource.manager.update(
              OrderItems,
              { orderId, itemId },
              { rating: customerRating, remarks },
            );
            const updateRatinginItem = await this.dataSource.manager.update(
              RestaurantMenu,
              { itemId },
              { ratingAVG: customerRating },
            );

            return new OrderItemRatingResponseDto(
              false,
              'Your feedback is updated, thanks for rate',
            );
          }
        } else {
          console.log('already updated');
          throw new HttpException('Already updated', 1012, {
            description:
              'You can not submit rate once you submit your feedback',
          });
        }
      } else {
        throw new HttpException('Not found order item', 1011, {
          description: 'Not able to found order',
        });
      }
    } catch (error) {
      if (error.status === 1011) {
        throw new NotFoundException(error.options.description);
      } else if (error.status === 1012) {
        throw new BadRequestException(error.options.description);
      } else {
        throw new BadGatewayException();
      }
    }
  }

  async ratingForOrder(
    customerId: string,
    orderId: string,
    ratingReqDto: OrderRatingRequestDto,
  ): Promise<OrderRatingResponseDto> {
    const { rating, remarks } = ratingReqDto;
    try {
      const findOrder = await this.dataSource.manager.findOne(Order, {
        where: { customerId, orderId, orderStatus: OrderStatus.DELIVERED },
      });

      if (findOrder) {
        if (findOrder.deliveryRatings === null) {
          const deliveryRating = await this.dataSource.manager.update(
            Order,
            { customerId, orderId },
            { deliveryRatings: rating, deliveryRemarks: remarks },
          );
          if (deliveryRating.affected > 0) {
            return new OrderRatingResponseDto(
              false,
              'Rating updated successfully.',
            );
          } else {
            throw new HttpException('Not update', 1015, {
              description: 'Rating not updated',
            });
          }
        } else {
          throw new HttpException('Already Updated', 1016, {
            description: 'You can not update once you submit the rating',
          });
        }
      } else {
        throw new HttpException('Not found', 1017, {
          description: 'Not found the order,',
        });
      }
    } catch (error) {
      if (error.status === 1015) {
        throw new BadRequestException(error.options.description);
      } else if (error.status === 1016) {
        throw new BadRequestException(error.options.description);
      } else if (error.status === 1017) {
        throw new NotFoundException(error.options.description);
      } else {
        throw new BadGatewayException();
      }
    }
  }

  async cancelOrder(orderId: string) {
    try {
      const order = await this.dataSource.manager.findOneBy(Order, {
        orderId,
        orderStatus: OrderStatus.PAID,
      });

      let message;
      if (order) {
        if (order.isrestaurantAccepted === false) {
          message = 'The restaurant is not able to serve your order request.';
        } else if (
          order.isrestaurantAccepted === true &&
          order.isDeliveryAccepted === false
        ) {
          message = 'Delivery boy not available to deliver your order.';
        }

        if (message.length > 0) {
          const updated = await this.dataSource.manager.update(
            Order,
            {
              orderId,
            },
            {
              orderStatus: OrderStatus.REJECTED,
              rejectionReason: message,
            },
          );

          if (updated.affected === 1) {
            console.log('Order canceled.');
          }
        }
      } else {
        console.log('order not found.');
      }
    } catch (error) {
      console.log(error);
      throw new BadGatewayException();
    }
  }

  async cancelOrderByUser(
    orderId: string,
    customerId: string,
  ): Promise<OrderCancelResponseDto> {
    try {
      const order = await this.dataSource.manager.findOne(Order, {
        where: { orderId, customerId },
      });

      if (
        order.orderStatus === OrderStatus.PAID &&
        order.isrestaurantAccepted === false
      ) {
        const cancelled = await this.dataSource.manager.update(
          Order,
          { orderId },
          {
            orderStatus: OrderStatus.CANCELED,
            rejectionReason: 'Order cancelled by user.',
          },
        );

        if (cancelled.affected === 1) {
          return new OrderCancelResponseDto(
            false,
            'Order cancelled successfully.',
          );
        }
      } else if (order.isrestaurantAccepted === true) {
        throw new HttpException('Restaurant accepted', 1031, {
          description:
            'Your order has been accepted. Hence you cannot cancel your order.',
        });
      } else if (order.orderStatus === OrderStatus.CANCELED) {
        throw new HttpException('Already cancelled', 1032, {
          description: 'You have already canceled your order.',
        });
      }
    } catch (error) {
      if (error.status === 1031 || error.status === 1032) {
        throw new BadRequestException(error.options.description);
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to cancel your order.');
      }
    }
  }
}
