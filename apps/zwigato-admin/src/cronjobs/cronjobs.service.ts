import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Customer } from 'src/db/entities/customer.entity';
import { DeliveryAgent } from 'src/db/entities/deliveryAgent.entity';
import { Order, OrderStatus } from 'src/db/entities/order.entity';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { EmailResponse, EmailSubjects, MailService } from 'src/mail/mail.service';
import { EntityManager, DataSource, In, Not, Between, IsNull } from 'typeorm';

@Injectable()
export class CronjobsService {
  private manager: EntityManager;
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private mailService: MailService,
  ) {
    this.manager = this.dataSource.manager;
  }

    // per day 9 0 9 * * *, per 1min * * * * * , 	2:30 at night 30 2 * * *
  @Cron('0 9 1 * *')
  async getSum() {
    try {
      const queryBuilder = this.manager.createQueryBuilder();
      let result = await queryBuilder
        .select(
          'Sum(order.totalAmount),"order"."customerId" custid'
        )
        .from(Order, 'order')
        .where('order.orderStatus = :status', {
          status: OrderStatus.DELIVERED,
        })
        .groupBy('custid')
        .execute();
      let dataupdate = result.forEach(async (element) => {
        await this.manager.update(Customer, { customerId: element.custid }, { monthOrderValue: element.sum })
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // per day 9 , per 1min * * * * *
  @Cron('0 9 1 * *') 
  async disableRestaurant() {
    try {
      let currentDate: Date = new Date();
      let startDate = new Date();
      startDate.setMonth(currentDate.getMonth() - 1)
      const queryBuilder = this.manager.createQueryBuilder();
      let result = await queryBuilder
        .select(
          '"order"."restaurantId"'
        )
        .from(Order, 'order')
        .where('order.orderPlacedOn > :startDate', { startDate: startDate })
        .andWhere('order.orderPlacedOn < :endDate', { endDate: currentDate })
        .groupBy('order.restaurantId')
        .execute()

      let orderWithRestaurant = result.map((i) => {
        return i.restaurantId
      });
      console.log(orderWithRestaurant);
      // const updateStatus=await this.manager.update(Restaurant,{},{isVerified:false})
      let found = await this.manager.update(Restaurant, { isVerified: true, restaurantId: Not(In(orderWithRestaurant)) }, { isVerified: false })
      console.log(found);
      if (found.affected > 0) {
        let disableMail = await this.manager.find(Restaurant, { select: { restaurantEmail: true }, where: { restaurantId: Not(In(orderWithRestaurant)) } })
        console.log(disableMail);
        this.mailService.verificationEmail({
          toEmail: disableMail.map((disableMail) => disableMail.restaurantEmail),
          subject: EmailSubjects.DISABLE_NOTIFICATION,
          responseHBS: EmailResponse.DISABLE_NOTIFICATION,
          customObject: {  },
        });
        console.log("expired");
      }
    } catch (error) {
      console.log(error);
      // throw new BadRequestException(error);
    }
  }

    // per day 9 , per 1min * * * * *
  @Cron('0 9 1 * *')
  async disableDeliveryAgent() {
    try {
      let currentDate: Date = new Date();
      let startDate = new Date();
      startDate.setMonth(currentDate.getMonth() - 1)

      const queryBuilder = this.manager.createQueryBuilder();
      let result = await queryBuilder
        .select(
          '"order"."deliveryAgentId"'
        )
        .from(Order, 'order')
        .where('order.orderPlacedOn > :startDate', { startDate: startDate })
        .andWhere('order.orderPlacedOn < :endDate', { endDate: currentDate })
        .groupBy('order.deliveryAgentId')
        .execute()

      let orderWithDeliveryAgent = result.map((i) => {
        return i.deliveryAgentId
      });
      let found = await this.manager.update(DeliveryAgent, { isVerified: true, agentId: Not(In(orderWithDeliveryAgent)) }, { isVerified: false })
      if (found.affected > 0) {
        let disableMail = await this.manager.find(DeliveryAgent, { select: { agentEmail: true }, where: { agentId: Not(In(orderWithDeliveryAgent)) } })
        this.mailService.verificationEmail({
          toEmail: disableMail.map((disableMail) => disableMail.agentEmail),
          subject: EmailSubjects.DISABLE_NOTIFICATION,
          responseHBS: EmailResponse.DISABLE_NOTIFICATION,
          customObject: {},
        });
        console.log("expired");
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
