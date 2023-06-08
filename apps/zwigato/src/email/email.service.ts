import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailservice: MailerService,
    private configService: ConfigService,
  ) {}

  async send(mailOptions: MyMailOptions) {
    const { responseHBS, subject, toEmail, customObject } = mailOptions;
    const result = await this.mailservice.sendMail({
      from: this.configService.get<string>('SENDING_USER'),
      to: toEmail,
      subject,
      template: responseHBS,
      context: {
        data: customObject,
      },
    });
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
  REGISTER_OTP = 'Otp to register for Zwigato',
  REGISTER_SUCCESS = 'Registration Successfull for Zwigato App',
  ORDER_SUCCESS = 'You got the order ,accept that ',
}

export enum EmailResponse {
  REGISTER_OTP = 'registrationOtp',
  REGISTER_SUCCESS = 'registrationResponse',
  ORDER_SUCCESS = 'newOrderPlace',
}
