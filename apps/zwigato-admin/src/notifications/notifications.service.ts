import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Customer } from 'src/db/entities/customer.entity';
import { RestaurantMenu } from 'src/db/entities/restaurantMenu.entity';
import { MailService, EmailSubjects, EmailResponse } from 'src/mail/mail.service';
import { DataSource, ILike } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  @Cron('0 0 6 * * *')
  async goodMorning() {
    try {
      const customers = await this.dataSource.manager.find(Customer, {
        select: { customerEmail: true, customerName: true },
      });

      if (customers.length > 0) {
        const snacks = await this.dataSource.manager.find(RestaurantMenu, {
          where: { foodCategory: { categoryName: ILike('%Gujarati%') } },
          relations: { foodCategory: true },
          order: { ratingAVG: 'DESC' },
        });

        if (snacks.length > 5) {
          this.mailService.verificationEmail({
            toEmail: customers.map((customer) => customer.customerEmail),
            subject: EmailSubjects.GOOD_MORNING,
            responseHBS: EmailResponse.GOOD_MORNING,
            customObject: { snacks: snacks.slice(0, 4) },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  
}
