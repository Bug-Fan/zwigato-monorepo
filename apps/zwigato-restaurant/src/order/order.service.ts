import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Order, OrderStatus } from '../database/entities/order.entity';
import {
  DataSource,
  EntityManager,
  In,
  IsNull,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateOrderData } from './dto/request/updateOrderData.dto';
import { getDeliveryAgentRes } from './dto/response/getDeliveryAgent.res.dto';
import { GetOrderDetailsRes } from './dto/response/getOrderDetails.res.dto';
import { DeliveryAgent } from 'src/database/entities/deliveryAgent.entity';
import { GeoCoddingService } from 'src/order/geoCodding.service';
import { OrderBroadcast } from 'src/database/entities/orderBroadcast.entity';
import { CommonResDto } from 'src/dto/commonResponse.dto';

export enum Distance {
  normal = 10,
  extended = 15,
}

@Injectable()
export class OrderService {
  private manager: EntityManager;
  constructor(
    @Inject('DataSource') datasource: DataSource,
    private geoCodingServide: GeoCoddingService,
  ) {
    this.manager = datasource.manager;
  }

  async getOrders(
    restaurantId: string,
    orderStatus: OrderStatus,
  ): Promise<GetOrderDetailsRes> {
    const data = await this.manager.find(Order, {
      where: [{ restaurantId, orderStatus: orderStatus }],
    });
    try {
      if (data.length > 0) {
        const orderData = await this.manager.find(Order, {
          select: {
            orderId: true,
            customer: {
              customerId: true,
              customerName: true,
              customerPhone: true,
            },
            orderStatus: true,
            isrestaurantAccepted: true,
            isDeliveryAccepted: true,
            orderItems: {
              orderItemId: true,
              itemName: true,
              quantity: true,
              itemTotalAmount: true,
              orderAddOn: {
                orderAddonName: true,
                orderAddOnId: true,
                orderAddOnPrice: true,
                quantity: true,
                totalAddonPrice: true,
              },
            },
          },
          relations: ['orderItems', 'orderItems.orderAddOn', 'customer'],
          where: [{ restaurantId, orderStatus: orderStatus }],
        });
        return new GetOrderDetailsRes(false, 'Order Data', orderData);
      } else {
        throw new BadRequestException('Order Not Available In Your List');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOrdersById(
    restaurantId: string,
    id: string,
  ): Promise<GetOrderDetailsRes> {
    const data = await this.manager.find(Order, {
      where: [{ restaurantId, orderId: id }],
    });
    try {
      if (data.length > 0) {
        const orderData = await this.manager.find(Order, {
          select: {
            orderId: true,
            customer: {
              customerId: true,
              customerName: true,
              customerPhone: true,
            },
            orderStatus: true,
            isrestaurantAccepted: true,
            isDeliveryAccepted: true,
            orderItems: {
              orderItemId: true,
              itemName: true,
              quantity: true,
              itemTotalAmount: true,
              orderAddOn: {
                orderAddonName: true,
                orderAddOnId: true,
                orderAddOnPrice: true,
                quantity: true,
                totalAddonPrice: true,
              },
            },
          },
          relations: ['orderItems', 'orderItems.orderAddOn', 'customer'],
          where: [{ restaurantId, orderId: id }],
        });
        return new GetOrderDetailsRes(false, 'Order Data', orderData);
      } else {
        throw new BadRequestException('Order Not Available In Your List');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateConformation(
    restaurantId: string,
    orderId: string,
    status: boolean,
  ) {
    try {
      let updateData: QueryDeepPartialEntity<Order> = {
        isrestaurantAccepted: status,
      };
      if (!status) {
        updateData.rejectionReason = 'Resturant Rejected..!';
        updateData.orderStatus = OrderStatus.REJECTED;
      }

      const updateResult = await this.manager.update(
        Order,
        {
          orderId,
          isrestaurantAccepted: false,
          orderStatus: OrderStatus.PAID,
          restaurantId,
        },
        updateData,
      );
      let updatedData;
      if (updateResult.affected > 0) {
        updatedData = await this.manager.findOne(Order, {
          select: {
            orderId: true,
            customer: {
              customerId: true,
              customerName: true,
              customerPhone: true,
            },
            restaurant: {
              restaurantLatitude: true,
              restaurantLongitude: true,
            },
            orderStatus: true,
            isrestaurantAccepted: true,
            isDeliveryAccepted: true,
            orderItems: {
              orderItemId: true,
              itemName: true,
              quantity: true,
              itemTotalAmount: true,
              orderAddOn: {
                orderAddonName: true,
                orderAddOnId: true,
                orderAddOnPrice: true,
                quantity: true,
                totalAddonPrice: true,
              },
            },
          },
          relations: [
            'orderItems',
            'orderItems.orderAddOn',
            'customer',
            'restaurant',
          ],
          where: { restaurantId, orderId: orderId },
        });
        if (status) {
          const notTobeSearched = await this.sendRequestToDeliveryBoy(
            updatedData.orderId,
            Distance.normal,
          );
          setTimeout(async () => {
            await this.sendRequestToDeliveryBoy(
              updatedData.orderId,
              Distance.extended,
              notTobeSearched,
            );
          }, 60000);
        }
        return new GetOrderDetailsRes(false, 'Data found', [updatedData]);
      } else {
        throw new BadRequestException('Order Not Available In Your List.');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateOrderStatus(
    restaurantId: string,
    orderId: string,
    updateOrderData: UpdateOrderData,
  ): Promise<CommonResDto> {
    try {
      const updateOrder = await this.manager.update(
        Order,
        { restaurantId, orderId, orderStatus: OrderStatus.ACCEPTED },
        updateOrderData,
      );
      if (updateOrder.affected > 0) {
        return new CommonResDto(true, 'Data Updated Sucessfully...');
      } else {
        throw new BadRequestException('Order Data Not Avaliable');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAgent(
    restaurantId: string,
    orderId: string,
  ): Promise<getDeliveryAgentRes> {
    try {
      const findAgentData = await this.manager.findOne(Order, {
        select: {
          orderId: true,
          deliveryAgent: {
            agentId: true,
            agentName: true,
            agentPhone: true,
            vehicaleNumber: true,
          },
        },
        where: {
          restaurantId,
          orderId,
          orderStatus: MoreThanOrEqual(OrderStatus.ACCEPTED),
        },
        relations: ['deliveryAgent'],
      });

      if (findAgentData) {
        return new getDeliveryAgentRes(
          false,
          'DeliveryAgentData',
          findAgentData,
        );
      } else {
        throw new BadRequestException(
          'Delivery boy not assign for this order ',
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendRequestToDeliveryBoy(
    orderId: string,
    distanceLimit,
    notToBeSearched: string[] = [],
  ): Promise<any> {
    let order = await this.manager.findOne(Order, {
      select: {
        orderId: true,
        isDeliveryAccepted: true,
        restaurant: { restaurantLatitude: true, restaurantLongitude: true },
      },
      where: { orderId: orderId, orderStatus: OrderStatus.PAID },
      relations: ['restaurant'],
    });

    if (order) {
      const freeDeliveryAgents = await this.manager.find(DeliveryAgent, {
        select: {
          agentId: true,
          agentLatitude: true,
          agentLongitude: true,
        },
        where: {
          isFree: true,
          isActive: true,
          ...(notToBeSearched.length > 0 && {
            agentId: Not(In(notToBeSearched)),
          }),

          orderBroadcast: { deliveryAgent: IsNull() },
        },

        relations: { orderBroadcast: true },
      });
      if (freeDeliveryAgents.length > 0) {
        let distance: any[] = await this.geoCodingServide.findDistance(
          freeDeliveryAgents,
          order.restaurant,
        );
        const broadcast: OrderBroadcast[] = [];
        freeDeliveryAgents.forEach((agent, index) => {
          if (
            distance[index].travelDistance < distanceLimit &&
            distance[index].travelDistance != -1
          ) {
            broadcast.push(
              this.manager.create(OrderBroadcast, {
                deliveryAgentId: freeDeliveryAgents[index].agentId,
                orderId,
              }),
            );
          } else if (distance[index].travelDistance > Distance.extended) {
            notToBeSearched.push(agent.agentId);
          }
        });
        await this.manager.save(broadcast);
        if (distanceLimit == Distance.extended) {
          setTimeout(() => {
            this.manager.update(
              Order,
              {
                orderId: order.orderId,
                orderStatus: OrderStatus.PAID,
              },
              {
                orderStatus: OrderStatus.REJECTED,
                rejectionReason: 'Delivery boy not found',
              },
            );
          }, 60000);
        }
        return notToBeSearched;
      }
    }
  }
}
