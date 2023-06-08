import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailService: MailerService,
    private configs: ConfigService,
  ) {}

  async verificationEmail(mailOption: MyMailOptions) {
    const { responseHBS, subject, toEmail, customObject } = mailOption;
    const response = await this.mailService.sendMail({
      from: this.configs.get<string>('SENDING_USER'),
      to: toEmail,
      subject,
      template: responseHBS,
      context: {
        data: customObject,
      },
    });
    return response;
  }
}

export class MyMailOptions {
  toEmail: string;
  subject: EmailSubjects;
  responseHBS: EmailResponse;
  customObject: any;
  constructor(
    toEmail: string,
    subject: EmailSubjects,
    emailResponseHBS: EmailResponse,
    obj: any,
  ) {
    this.toEmail = toEmail;
    this.subject = subject;
    this.responseHBS = emailResponseHBS;
    this.customObject = obj;
  }
}
export enum EmailSubjects {
  RESTAURANTVERIFIED = 'Restaurant verification completed',
  DELIVERYPARTNERVERIFIED = 'Delivery agent verification completed',
  OTPSENDDELIVERYAGENT = 'verify your account with otp',
  AGENTREGISTERED = 'agent registered successfully',
  DELIVEREDORDER = 'Order is Delivered Successfully',
  INVOICECOPY = 'Your Order Invoice',
  ACCEPTED = 'Order Accept',
  PICKED = 'Order Picked',
}
export enum EmailResponse {
  VERIFICATION_SUCCESS = 'verification',
  OTP_SEND = 'otp',
  AGENTREGISTERED = 'registrationdone',
  RESTAURANTVERIFIED = 'Restaurant verification',
  DELIVERYPARTNERVERIFIED = 'Delivery agent verification',
  BLOCK_USER = 'block',
  INVOICE = 'invoice',
  TRACORDER = 'trackorder',
}
