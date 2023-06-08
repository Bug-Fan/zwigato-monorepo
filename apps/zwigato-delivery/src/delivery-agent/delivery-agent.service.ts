import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import {
  EmailResponse,
  EmailSubjects,
  MailService,
  MyMailOptions,
} from '../mail/mail.service';
import { DataSource, EntityManager, IsNull } from 'typeorm';
import { UpdateProfileReqDto } from './dto/request/updateProfile.req.dto';
import { DeliveryAgent } from '../db/entities/deliveryAgent.entity';
import { UpdateProfileResDto } from './dto/response/updateProfile.res.dto';
import { ActiveDeliveryAgentAccountReqDto } from './dto/request/activeDeliveryAgentAccount.req.dto';
import { ActiveDeliveryAgentAccountResDto } from './dto/response/activeDeliveryAgentAccount.res.dto';
import { DeleteDeliverAgentResDto } from './dto/response/deleteDeliveryAgent.res.dto';
import { Order, OrderStatus } from '../db/entities/order.entity';
import { ListOrderResDto } from './dto/response/listOrder.res.dto';
import { GeoCoddingService } from '../geoCodding.service';
import { AcceptOrderResDto } from './dto/response/acceptOrder.res.dto';
import { ReachDropLocationResDto } from './dto/response/reachDropLocation.res.dto';
import { TripReportResDto } from './dto/response/tripReport.res.dto';
import { RejectOrderResDto } from './dto/response/rejectOrder.res.dto';
import { DeliverOrderResDto } from './dto/response/deliverOrder.res.dto';
import { FeedbackRatingResDto } from './dto/response/feedbackRating.res.dto';
import { FeedbackRatingReqDto } from './dto/request/feedbackRating.req.dto';
import { AvgRatingResDto } from './dto/response/avgRating.res.dto';
import { OrderItems } from '../db/entities/orderItems.entity';
import { updateLocationResponseDto } from './dto/response/updatelocation.response.dto';
import { OrderBroadcast } from '../db/entities/orderBroadcast.entity';
import { UsedCoupons } from 'src/db/entities/usedCoupons.entity';

@Injectable()
export class DeliveryAgentService {
  private manager: EntityManager;
  ratings: any;
  constructor(
    @Inject('DataSource')
    private dataSource: DataSource,
    public mailService: MailService,
    private geoCoddingService: GeoCoddingService,
  ) {
    this.manager = this.dataSource.manager;
  }

  // update Profile
  async updateProfile(
    updateProfileReqDto: UpdateProfileReqDto,
    imgArr,
    uuid,
  ): Promise<UpdateProfileResDto> {
    try {
      const deliveryAgentData = await this.manager.findOneBy(DeliveryAgent, {
        agentId: uuid,
        isVerified: true,
        isEmailVerified: true,
        isDeposited: true,
        isDeleted: false,
      });

      console.log(imgArr);

      const {
        agentAddressLine1,
        agentAddressLine2,
        pincode,
        city,
        state,
        agentLatitude,
        agentLongitude,
        agentPhone,
        vehicleNumber,
        bankName,
        bankIFSC,
        bankAccountNumber,
      } = updateProfileReqDto;

      if (deliveryAgentData) {
        const agentRcBook = imgArr.find(
          (o) => o.fieldname == 'rcBookImagePath',
        );

        const agentPassBook = imgArr.find(
          (o) => o.fieldname == 'passBookImagePath',
        );

        const agentProfile = imgArr.find(
          (o) => o.fieldname == 'agentProfilePath',
        );

        if (agentRcBook) {
          deliveryAgentData.agentRCBookImagePath = agentRcBook.filename;
        }
        if (agentPassBook) {
          deliveryAgentData.passBookImagePath = agentPassBook.filename;
        }
        if (agentProfile) {
          deliveryAgentData.agentProfilePath = agentProfile.filename;
        }

        deliveryAgentData.agentAddressLine1 = agentAddressLine1;
        deliveryAgentData.agentAddressLine2 = agentAddressLine2;
        deliveryAgentData.pincode = pincode;
        deliveryAgentData.city = city;
        deliveryAgentData.state = state;
        deliveryAgentData.agentLatitude = agentLatitude;
        deliveryAgentData.agentLongitude = agentLongitude;
        deliveryAgentData.agentPhone = agentPhone;
        deliveryAgentData.vehicaleNumber = vehicleNumber;
        deliveryAgentData.bankName = bankName;
        deliveryAgentData.bankIFSC = bankIFSC;
        deliveryAgentData.bankAccountNumber = bankAccountNumber;

        await this.manager.update(
          DeliveryAgent,
          { agentId: uuid },
          deliveryAgentData,
        );

        return new UpdateProfileResDto(true, 'Data Update Successfully');
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      if (err.status == 404) {
        throw new NotFoundException(
          'User is not found!! Otherwise user is not verified!',
        );
      } else {
        throw new BadRequestException('something went wrong');
      }
    }
  }

  //activeAccount
  async activeAccount(
    activeDeliveryAgentAccountReqDto: ActiveDeliveryAgentAccountReqDto,
    uuid,
  ): Promise<ActiveDeliveryAgentAccountResDto> {
    try {
      const { activeStatus } = activeDeliveryAgentAccountReqDto;
      const deliveryAgentData = await this.manager.findOneBy(DeliveryAgent, {
        agentId: uuid,
        isVerified: true,
        isEmailVerified: true,
        isDeposited: true,
        isDeleted: false,
        isActive: !activeStatus,
      });

      if (deliveryAgentData) {
        let msg;
        if (!activeStatus) {
          // deliveryAgentData.isActive = activeStatus;
          msg = 'You are now offline';
        } else {
          // deliveryAgentData.isActive = activeStatus;
          msg = 'You are now online';
        }

        await this.manager.update(
          DeliveryAgent,
          { agentId: uuid },
          { isActive: activeStatus },
        );
        return new ActiveDeliveryAgentAccountResDto(true, msg);
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      if (err.status == 404) {
        throw new NotFoundException(
          'User is not found!! Otherwise user is not verified!',
        );
      } else {
        throw new BadRequestException('something went wrong');
      }
    }
  }

  // deleteAccount
  async deleteAccount(isDelete, uuid): Promise<DeleteDeliverAgentResDto> {
    try {
      const deliveryAgentData = await this.manager.findOneBy(DeliveryAgent, {
        agentId: uuid,
        isVerified: true,
        isEmailVerified: true,
        isDeposited: true,
        isDeleted: false,
      });

      if (deliveryAgentData) {
        // deliveryAgentData.isDeleted = isDelete;
        await this.manager.update(
          DeliveryAgent,
          { agentId: uuid },
          { isDeleted: isDelete, isActive: false },
        );

        return new DeleteDeliverAgentResDto(true, 'User Deleted Successfully');
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      throw new NotFoundException(
        'User is not found!! Otherwise user is not verified!',
      );
    }
  }

  //listOrderByStatus
  async listOrderByStatus(uuid, query): Promise<ListOrderResDto> {
    try {
      const orderData = await this.manager.find(OrderBroadcast, {
        where: {
          deliveryAgentId: uuid,
        },
        relations: {
          order: {
            restaurant: true,
            customer: true,
            orderItems: {
              orderAddOn: true,
            },
          },
        },
      });
      //find restaurant and deliveragent latitude and longtitude
      if (orderData) {
        return new ListOrderResDto(true, 'List Of Order', orderData);
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      throw new NotFoundException('Order is not found');
    }
  }

  //listOrder
  async listOrder(uuid): Promise<ListOrderResDto> {
    try {
      const orderData = await this.manager.find(OrderBroadcast, {
        where: {
          deliveryAgentId: uuid,
          order: {
            isDeliveryAccepted: false,
            isrestaurantAccepted: true,
            orderStatus: OrderStatus.PAID,
          },
        },
        relations: {
          order: {
            restaurant: true,
            customer: true,
            orderItems: {
              orderAddOn: true,
            },
          },
        },
      });

      if (orderData) {
        return new ListOrderResDto(true, 'List Of Order', orderData);
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      throw new NotFoundException('Order is not found');
    }
  }

  //acceptOrder
  async acceptOrder(uuid, deliveryAgentid): Promise<AcceptOrderResDto> {
    try {
      // if (orderData) {

      const orderData1 = await this.manager.find(Order, {
        where: { deliveryAgentId: deliveryAgentid },
        select: { deliveryAgentId: true },
      });

      if (orderData1.length == 0) {
        await this.manager.update(
          DeliveryAgent,
          {
            agentId: deliveryAgentid,
          },
          {
            firstOrderDate: new Date(),
            isFree: false,
          },
        );
      }

      let updateResult = await this.manager.update(
        Order,
        {
          orderId: uuid,
          isrestaurantAccepted: true,
          isDeliveryAccepted: false,
          orderStatus: OrderStatus.PAID,
        },
        {
          isDeliveryAccepted: true,
          orderStatus: OrderStatus.ACCEPTED,
          deliveryAgentId: deliveryAgentid,
        },
      );

      if (updateResult.affected > 0) {
        const orderData = await this.manager.findOne(Order, {
          select: {
            restaurant: {
              restaurantName: true,
              restaurantPhone: true,
              restaurantEmail: true,
              restaurantAddressLine1: true,
              restaurantAddressLine2: true,
              pincode: true,
              city: true,
            },

            customer: {
              customerName: true,
              customerPhone: true,
              customerEmail: true,
            },

            deliveryAgent: {
              agentName: true,
              agentPhone: true,
            },
            coupon: { couponId: true },
          },
          where: {
            orderId: uuid,
          },
          relations: {
            restaurant: true,
            customer: true,
            deliveryAgent: true,
            orderItems: { orderAddOn: true },
            coupon: true,
          },
        });

        await this.manager.delete(OrderBroadcast, { orderId: uuid });

        if (orderData.couponId != null) {
          const addUsedCoupons = await this.manager.create(UsedCoupons, {
            couponId: orderData.couponId,
            customerId: orderData.customerId,
          });

          await this.manager.save(UsedCoupons, addUsedCoupons);
        }

        this.mailService.verificationEmail(
          new MyMailOptions(
            orderData.customer.customerEmail,
            EmailSubjects.ACCEPTED,
            EmailResponse.TRACORDER,
            { orderData, msg: 'You have been assigned a delivery boy' },
          ),
        );

        return new AcceptOrderResDto(true, 'Order is Accepted', {
          restaurant_Details: orderData.restaurant,
          customer_Details: orderData.customer,
          customerAddressDetails: {
            custmerAddress: orderData.deliveryAddress,
            customerLat: orderData.addressLatitude,
            custmerLon: orderData.addressLongitude,
          },
          orderItems: orderData.orderItems,
        });
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      if (err.status == 404) {
        throw new NotFoundException('Order is not found');
      } else {
        throw new BadRequestException('Something went wrong');
      }
    }
  }

  //rejectOrder
  // async rejectOrder(uuid): Promise<RejectOrderResDto> {
  //   try {
  //     const orderData = await this.manager.findOne(Order, {
  //       where: {
  //         orderId: uuid,
  //         isrestaurantAccepted: true,
  //         isDeliveryAccepted: true,
  //       },
  //     });
  //     if (orderData) {
  //       await this.manager.update(
  //         Order,
  //         { orderId: uuid },
  //         {
  //           isDeliveryAccepted: false,
  //           deliveryAgentId: null,
  //           orderStatus: OrderStatus.REJECTED,
  //         },
  //       );
  //       return new RejectOrderResDto(true, 'Order is rejected');
  //     } else {
  //       throw new NotFoundException();
  //     }
  //   } catch (err) {
  //     if (err.status == 404) {
  //       throw new NotFoundException('Order is not found');
  //     } else {
  //       throw new BadRequestException(err.message);
  //     }
  //   }
  // }

  // changeOrderStatus
  async pickedOrder(uuid, statusOrder, msg): Promise<AcceptOrderResDto> {
    try {
      let updateResult = await this.manager.update(
        Order,
        {
          orderId: uuid,
          isrestaurantAccepted: true,
          isDeliveryAccepted: true,
          orderStatus: OrderStatus.PREPARING,
        },
        {
          orderStatus: statusOrder,
        },
      );

      if (updateResult.affected > 0) {
        const orderData = await this.manager.findOne(Order, {
          select: {
            restaurant: {
              restaurantName: true,
              restaurantPhone: true,
              restaurantAddressLine1: true,
              restaurantAddressLine2: true,
              pincode: true,
              city: true,
            },

            customer: {
              customerName: true,
              customerPhone: true,
              customerEmail: true,
            },

            deliveryAgent: {
              agentName: true,
              agentPhone: true,
            },
          },
          where: {
            orderId: uuid,
          },

          relations: {
            restaurant: true,
            customer: true,
            deliveryAgent: true,
            orderItems: { orderAddOn: true },
          },
        });

        if (!orderData) {
          throw new NotFoundException();
        }

        this.mailService.verificationEmail(
          new MyMailOptions(
            orderData.customer.customerEmail,
            EmailSubjects.PICKED,
            EmailResponse.TRACORDER,
            { orderData, msg: 'Your Order is Picked for deliver' },
          ),
        );
        return new AcceptOrderResDto(true, msg, {
          restaurant_Details: orderData.restaurant,
          customer_Details: orderData.customer,
          customerAddressDetails: {
            custmerAddress: orderData.deliveryAddress,
            customerLat: orderData.addressLatitude,
            custmerLon: orderData.addressLongitude,
          },
          orderItems: orderData.orderItems,
        });
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      if (err.status == 404) {
        throw new NotFoundException('Order is not found');
      } else {
        throw new BadRequestException('something went wrong');
      }
    }
  }

  async deliverOrder(
    uuid,
    statusOrder,
    deliveragentId,
    msg,
  ): Promise<DeliverOrderResDto> {
    try {
      const orderData = await this.manager.findOne(Order, {
        where: {
          orderId: uuid,
          isrestaurantAccepted: true,
          isDeliveryAccepted: true,
          orderStatus: OrderStatus.ARRIVED,
        },
        relations: ['customer', 'restaurant'],
      });

      const orderItem = await this.manager.find(OrderItems, {
        select: {
          itemName: true,
          quantity: true,
          itemPrice: true,
          itemTotalAmount: true,
        },
        where: { orderId: uuid },
        relations: { orderAddOn: true },
      });

      let data = new Date();

      if (orderData) {
        await this.manager.update(
          Order,
          { orderId: uuid },
          { orderStatus: statusOrder, deliveredOn: data },
        );

        await this.manager.update(
          DeliveryAgent,
          {
            agentId: deliveragentId,
          },
          {
            firstOrderDate: new Date(),
            isFree: true,
          },
        );

        let orderInvoice = {
          date: data,
          orderId: orderData.orderId,
          cutomerName: orderData.customer.customerName,
          customerAddress: orderData.deliveryAddress,
          subTotal: orderData.subTotal,
          sgst: orderData.sgst,
          cgst: orderData.cgst,
          deliveyCharges: orderData.deliveryCharges,
          totalAmount: orderData.totalAmount,
        };

        let itemDetails = [];

        for (let i = 0; i < orderItem.length; i++) {
          itemDetails.push({
            orderItem,
          });
        }

        this.mailService.verificationEmail(
          new MyMailOptions(
            orderData.customer.customerEmail,
            EmailSubjects.INVOICECOPY,
            EmailResponse.INVOICE,
            { itemDetails, orderInvoice },
          ),
        );

        return new DeliverOrderResDto(true, msg, {
          orderInvoice: orderInvoice,
          orderDetails: itemDetails,
        });
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      throw new NotFoundException('Order is not found');
    }
  }

  //reachDropLocation
  async reachDropLocation(uuid): Promise<ReachDropLocationResDto> {
    try {
      const orderData = await this.manager.findOne(Order, {
        where: {
          orderId: uuid,
          isDeliveryAccepted: true,
          isrestaurantAccepted: true,
        },
        relations: ['customer'],
      });
      if (orderData) {
        await this.manager.update(
          Order,
          { orderId: uuid },
          { orderStatus: OrderStatus.ARRIVED },
        );
        return new ReachDropLocationResDto(
          true,
          'Your Order is drop on your location, Please collect your order',
          { mobile: orderData.customer.customerPhone },
        );
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      throw new NotFoundException('Order is not found');
    }
  }

  async tripReport(uuid): Promise<TripReportResDto> {
    try {
      const orderData = await this.manager.find(Order, {
        where: {
          deliveryAgentId: uuid,
          isDeliveryAccepted: true,
          isrestaurantAccepted: true,
          orderStatus: OrderStatus.DELIVERED,
        },
        relations: ['restaurant', 'customer'],
      });

      const deliveryAgentData = await this.manager.findOneBy(DeliveryAgent, {
        agentId: uuid,
        isVerified: true,
        isEmailVerified: true,
        isDeposited: true,
        isDeleted: false,
      });

      let orderListArr = [];
      let totalEarning = 0;

      for (let i = 0; i < orderData.length; i++) {
        let distance = await this.geoCoddingService.findDistance(
          Number(deliveryAgentData.agentLatitude),
          Number(deliveryAgentData.agentLongitude),
          Number(orderData[i].restaurant.restaurantLatitude),
          Number(orderData[i].restaurant.restaurantLongitude),
        );

        totalEarning += Number(orderData[i].deliveryCharges);

        orderListArr.push({
          date: orderData[i].deliveredOn,
          orderId: orderData[i].orderId,
          restaurantName: orderData[i].restaurant.restaurantName,
          customerName: orderData[i].customer.customerName,
          tripEarning: orderData[i].deliveryCharges,
          distance: `${distance}km`,
        });
      }

      return new TripReportResDto(true, 'Show the trip report', {
        tripData: orderListArr,
        totalTripEarning: totalEarning,
      });
    } catch (err) {
      throw new BadRequestException('not found');
    }
  }

  async feedbackRating(
    uuid,
    feedbackRatingReqDto: FeedbackRatingReqDto,
  ): Promise<FeedbackRatingResDto> {
    const { rating, remark } = feedbackRatingReqDto;

    try {
      const orderData = await this.manager.findOne(Order, {
        where: {
          orderId: uuid,
          orderStatus: OrderStatus.DELIVERED,
          ratingToCustomer: IsNull(),
        },
      });

      if (orderData) {
        orderData.ratingToCustomer = rating;
        orderData.remarkToCustomer = remark;
        await this.manager.update(Order, { orderId: uuid }, orderData);
        return new FeedbackRatingResDto(true, 'Thank you for your feedback!');
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      if (err.status == 404) {
        throw new NotFoundException('Order is not found');
      } else {
        throw new BadRequestException('something went wrong');
      }
    }
  }

  async findAvgRating(uuid): Promise<AvgRatingResDto> {
    try {
      const orderData = await this.manager.find(Order, {
        where: {
          deliveryAgentId: uuid,
          orderStatus: OrderStatus.DELIVERED,
        },
      });

      if (orderData) {
        const totalRating = orderData.reduce(
          (acc, rating) => acc + +rating.deliveryRatings,
          0,
        );

        return new AvgRatingResDto(
          true,
          'This is you average rating',
          totalRating / orderData.length,
        );
      } else {
        throw new BadRequestException('something went wrong');
      }
    } catch (err) {
      throw new NotFoundException('Order is not found');
    }
  }

  async updateLocation(
    uuid,
    updateLocationRequest,
  ): Promise<updateLocationResponseDto> {
    const { agentLatitude, agentLongitude } = updateLocationRequest;
    try {
      const deliveryAgentData = await this.manager.findOneBy(DeliveryAgent, {
        agentId: uuid,
        isActive: true,
      });

      if (!deliveryAgentData) {
        throw new NotFoundException(
          'You are not active. Please activate to update location.',
        );
      } else {
        const updated = await this.manager.update(
          DeliveryAgent,
          { agentId: uuid },
          { agentLatitude, agentLongitude },
        );

        if (updated.affected > 0) {
          return new updateLocationResponseDto(
            true,
            'location updated Successfully',
          );
        } else {
          throw new NotFoundException();
        }
      }
    } catch (err) {
      throw new NotFoundException('not update');
    }
  }
}

// write jest setup for writing test cases
