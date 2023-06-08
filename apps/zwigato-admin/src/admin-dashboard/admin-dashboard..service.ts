import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Customer } from "src/db/entities/customer.entity";
import { DeliveryAgent } from "src/db/entities/deliveryAgent.entity";
import { Order, OrderStatus } from "src/db/entities/order.entity";
import { Restaurant } from "src/db/entities/restaurant.entity";
import {
  EmailResponse,
  EmailSubjects,
  MailService,
  MyMailOptions,
} from "src/mail/mail.service";
import {
  DataSource,
  EntityManager,
  ILike,
  InsertValuesMissingError,
} from "typeorm";
import { GetResByFilterRequestDto } from "./dto/request/getresbyfilter.request.dto";
import { GetCustomersResponseDto } from "./dto/response/getcustomers.response.dto";
import { GetDeliveryBoyResponseDto } from "./dto/response/getdeliveryboy.response.dto";
import { getOredersResponseDto } from "./dto/response/getOrders.response.dto";
import { GetRestaurantRes } from "./dto/response/getRestaurantRes.dto";
import { VerifyStatusResDto } from "./dto/response/verifyStatusRes.dto";
import { EarningRequestDTO } from "./dto/request/earning.request.dto";
import { EarningRes, EarningResponseDto } from "./dto/response/earning.res.dto";

@Injectable()
export class AdminService {
  private manager: EntityManager;
  constructor(
    @Inject("DataSource") private dataSource: DataSource,
    public mailService: MailService
  ) {
    this.manager = this.dataSource.manager;
  }

  //verify User
  async restaurantRequestVerify(
    uuid,
    verifyStatusReqDto
  ): Promise<VerifyStatusResDto> {
    const { isVerified } = verifyStatusReqDto;
    try {
      const restaurantData = await this.manager.findOneBy(Restaurant, {
        restaurantId: uuid,
        isVerified: !isVerified,
        isEmailVerified: true,
      });

      if (!restaurantData) {
        throw new NotFoundException(
          "Either user is already verified or blocked,  or User is not found"
        );
      } else {
        restaurantData.isVerified = isVerified;
        await this.manager.update(
          Restaurant,
          { restaurantId: uuid },
          restaurantData
        );

        if (!restaurantData.isVerified) {
          this.mailService.verificationEmail(
            new MyMailOptions(
              restaurantData.restaurantEmail,
              EmailSubjects.RESTAURANTVERIFIED,
              EmailResponse.BLOCK_USER,
              { name: restaurantData.restaurantName }
            )
          );

          return new VerifyStatusResDto(false, "Account Blocked Successfully");
        } else {
          this.mailService.verificationEmail(
            new MyMailOptions(
              restaurantData.restaurantEmail,
              EmailSubjects.RESTAURANTVERIFIED,
              EmailResponse.VERIFICATION_SUCCESS,
              { name: restaurantData.restaurantName }
            )
          );

          return new VerifyStatusResDto(false, "Account Verified Successfully");
        }
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deliveryAgentRequestVerify(
    uuid,
    verifyStatusReqDto
  ): Promise<VerifyStatusResDto> {
    const { isVerified } = verifyStatusReqDto;

    try {
      const deliveryAgentData = await this.manager.findOneBy(DeliveryAgent, {
        agentId: uuid,
        isVerified: !isVerified,
        isEmailVerified: true,
      });

      if (!deliveryAgentData) {
        throw new NotFoundException(
          "Either user is already verified or blocked,  or User is not found"
        );
      } else {
        deliveryAgentData.isVerified = isVerified;
        await this.manager.update(
          DeliveryAgent,
          { agentId: uuid },
          deliveryAgentData
        );

        if (!deliveryAgentData.isVerified) {
          this.mailService.verificationEmail(
            new MyMailOptions(
              deliveryAgentData.agentEmail,
              EmailSubjects.DELIVERYPARTNERVERIFIED,
              EmailResponse.BLOCK_USER,
              { name: deliveryAgentData.agentName }
            )
          );
          return new VerifyStatusResDto(false, "Account Blocked Successfully");
        } else {
          this.mailService.verificationEmail(
            new MyMailOptions(
              deliveryAgentData.agentEmail,
              EmailSubjects.DELIVERYPARTNERVERIFIED,
              EmailResponse.VERIFICATION_SUCCESS,
              { name: deliveryAgentData.agentName }
            )
          );
          return new VerifyStatusResDto(false, "Account Verified Successfully");
        }
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  //getRestaurant
  // isVerified=true&city=Ahmedabad&restaurantId=a0cf6a5f-8d4a-40d8-8fc4-d20ade661d3a&restaurantTypeId=1&state=Gujarat&restaurantName=Honest
  async getRestaurant(
    queryData: GetResByFilterRequestDto,
    page,
    limit
  ): Promise<GetRestaurantRes> {
    const take = limit || 3;
    const skip = (page - 1) * limit;
    try {
      const restaurantData = await this.manager.find(Restaurant, {
        where: {
          ...(queryData.restaurantName && {
            restaurantName: ILike(`%${queryData.restaurantName}%`),
          }),
          city: queryData.city,
          isActive: queryData.isActive,
          isVerified: queryData.isVerified,
        },
        take,
        skip,
        relations: ["restaurantType"],
      });

      if (!restaurantData) {
        throw new NotFoundException("Data is not found");
      } else {
        return new GetRestaurantRes(
          false,
          "Data Fetched Successfully",
          restaurantData
        );
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  //get all delivery boy
  async getDeliveryBoy(
    queryData,
    page,
    limit
  ): Promise<GetDeliveryBoyResponseDto> {
    const take = limit || 3;
    const skip = (page - 1) * limit;
    try {
      const deliveryboyData = await this.manager.find(DeliveryAgent, {
        where: queryData,
        take,
        skip,
      });
      if (!deliveryboyData) {
        throw new NotFoundException("Data is not found");
      } else {
        return new GetDeliveryBoyResponseDto(
          false,
          "Data Fetched Successfully",
          deliveryboyData
        );
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAllCustomer(page, limit): Promise<GetCustomersResponseDto> {
    const take = limit || 3;
    const skip = (page - 1) * limit;
    try {
      const customerData = await this.manager.find(Customer, {
        take,
        skip,
      });
      console.log(customerData);
      if (customerData) {
        return new GetCustomersResponseDto(
          false,
          "Data Fetched Successfully",
          customerData
        );
      } else {
        throw new NotFoundException("Data is not found");
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAllOrders(page, limit): Promise<getOredersResponseDto> {
    const take = limit || 3;
    const skip = (page - 1) * limit;
    try {
      const orderData = await this.manager.find(Order, {
        where: {
          orderStatus: OrderStatus.ACCEPTED,
        },
        take,
        skip,
      });
      console.log(orderData);
      if (!orderData) {
        throw new NotFoundException("Data is not found");
      } else {
        return new getOredersResponseDto(
          false,
          "Data Fetched Successfully",
          orderData
        );
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getEarnings(
    earningReqDTO: EarningRequestDTO
  ): Promise<EarningResponseDto> {
    try {
      const queryBuilder = this.manager.createQueryBuilder();
      const start = new Date(earningReqDTO.start);
      const end = new Date(earningReqDTO.end);
      let result = await queryBuilder
        .select(
          "count(order.orderId) Totalorders,Sum(order.platformProfit) Totalprofit"
        )
        .from(Order, "order")
        .where(
          "CAST(order.orderPlacedOn AS DATE) >= CAST (:start AS DATE) AND CAST(order.orderPlacedOn AS DATE) <= CAST (:end AS DATE)",
          {
            start,
            end,
          }
        )
        .andWhere("order.orderStatus = :status", {
          status: OrderStatus.DELIVERED,
        })
        .execute();
      return new EarningResponseDto(
        false,
        "Earning Data",
        new EarningRes(start.toISOString(), end.toISOString(), result[0].totalorders, result[0].totalprofit)
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
