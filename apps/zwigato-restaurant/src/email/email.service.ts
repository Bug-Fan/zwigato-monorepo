import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailservice: MailerService,
    private confService: ConfigService,
  ) {}

  async send(mailOptions: MyMailOptions) {
    const { responseHBS, subject, toEmail, customObject } = mailOptions;
    try {
      return await this.mailservice.sendMail({
        from: this.confService.get<string>('SENDING_USER'),
        to: toEmail,
        subject,
        template: responseHBS,
        context: {
          data: customObject,
        },
      });
    } catch (e) {
      throw new BadRequestException();
    }
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
  REGISTER_SUCCESS = 'Registration complete',
  OTP_SENT = 'Email Verification',
}

export enum EmailResponse {
  REGISTER_SUCCESS = 'registration_response',
  OTP_RESPONSE = 'registration_otp',
}
