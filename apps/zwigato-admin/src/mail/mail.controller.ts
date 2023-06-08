import { Controller, Get } from '@nestjs/common';

import {
  EmailResponse,
  EmailSubjects,
  MailService,
  MyMailOptions,
} from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}
  @Get()
  async verificationEmail() {
    return await this.mailService.verificationEmail(
      new MyMailOptions(
        'parthitadara@gmail.com',
        EmailSubjects.RESTAURANTVERIFIED,
        EmailResponse.VERIFICATION_SUCCESS,
        { a: 'hello' },
      ),
    );
  }
}
