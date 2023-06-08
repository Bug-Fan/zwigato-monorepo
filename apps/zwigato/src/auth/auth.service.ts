import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from 'src/db/entities/customer.entity';
import { DataSource } from 'typeorm';
import { genSalt, hash, compare } from 'bcrypt';
import { CustomerRegistrationRequestDto } from './dto/req/customer.registration.request.dto';
import {
  EmailResponse,
  EmailService,
  EmailSubjects,
} from 'src/email/email.service';
import { CustomerLoginRequestDto } from './dto/req/customer.login.request.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';
import { CustomerOtpRequestDto } from './dto/req/customer.otp.request.dto';
import { unlink } from 'fs';
import { LoginResponseDto } from './dto/res/login.response.dto';
import { RegistrationResponseDto } from './dto/res/registration.response.dto';
import { VerificationResponseDto } from './dto/res/verification.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async registerCustomer(
    registerUserDto: CustomerRegistrationRequestDto,
    profileImage,
  ): Promise<CommonResponseDto> {
    const { customerName, customerEmail, customerPhone } = registerUserDto;
    let { customerPassword } = registerUserDto;

    try {
      const salt = await genSalt();
      customerPassword = await hash(customerPassword, salt);
      const OTP = this.generateOtp();

      const customerRegistration = await this.dataSource.manager.insert(
        Customer,
        {
          customerName,
          customerEmail,
          customerPassword,
          customerPhone,
          OTP,
          profilePath: profileImage.filename,
        },
      );

      if (customerRegistration.identifiers.length === 1) {
        this.emailService.send({
          toEmail: customerEmail,
          subject: EmailSubjects.REGISTER_OTP,
          responseHBS: EmailResponse.REGISTER_OTP,
          customObject: { customerName, OTP },
        });

        const customerId = customerRegistration.identifiers[0].customerId;
        const timer = setTimeout(
          () => this.cancelRegistration(customerId, profileImage.path),
          120000,
        );

        return new RegistrationResponseDto(
          false,
          'We have sent an OTP on your email address, please verify OTP to complete registration process.',
        );
      }
    } catch (error) {
      if (error.code && error.code == 23505) {
        throw new ConflictException('You are already registered! Please login');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to register you');
      }
    }
  }

  async loginCustomer(
    loginCustomer: CustomerLoginRequestDto,
  ): Promise<LoginResponseDto> {
    const { customerEmail, customerPassword } = loginCustomer;
    try {
      const customer = await this.dataSource.manager.findOne(Customer, {
        where: {
          customerEmail,
          isEmailVerified: true,
        },
      });
      if (customer) {
        const customerId = customer.customerId;
        if (await compare(customerPassword, customer.customerPassword)) {
          const payload = { customerId, role: 'user' };
          const token: string = await this.jwtService.signAsync(payload);
          return new LoginResponseDto(false, 'Login successfull.', token);
        } else {
          throw new BadRequestException();
        }
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('You are not registered. Please Register');
      } else if (error.status === 400) {
        throw new BadRequestException('Your password is incorrect. Try again');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to log you in');
      }
    }
  }

  async verifyCustomer(
    customerOtp: CustomerOtpRequestDto,
  ): Promise<VerificationResponseDto> {
    const { OTP, customerEmail } = customerOtp;

    try {
      const customer = await this.dataSource.manager.findOne(Customer, {
        where: {
          customerEmail,
          isEmailVerified: false,
        },
      });
      if (customer) {
        if (customer.OTP === OTP) {
          const verifiedUser = await this.dataSource.manager.update(
            Customer,
            { customerEmail },
            { isEmailVerified: true },
          );
          if (verifiedUser.affected === 1) {
            this.emailService.send({
              toEmail: customerEmail,
              subject: EmailSubjects.REGISTER_SUCCESS,
              responseHBS: EmailResponse.REGISTER_SUCCESS,
              customObject: {
                customerName: customer.customerName,
              },
            });

            return new VerificationResponseDto(
              false,
              'Your registration is successfull, Welcome to zwigato.',
            );
          } else {
            throw new BadGatewayException();
          }
        } else {
          throw new BadRequestException();
        }
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(
          'You are not registered, or you are already verified.',
        );
      } else if (error.status === 400) {
        throw new BadRequestException('Your entered otp is incorrect.');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to confirm your registration.');
      }
    }
  }

  async cancelRegistration(customerId: string, path) {
    try {
      const verified = await this.dataSource.manager.findOneBy(Customer, {
        customerId,
      });

      if (verified.isEmailVerified === false) {
        const deleted = await this.dataSource.manager.delete(Customer, {
          customerId,
        });
        unlink(path, () => true);
        if (deleted.affected === 1) {
          console.log('Registration cancelled.');
        }
      }
    } catch (error) {
      console.log(error);
      throw new BadGatewayException();
    }
  }

  generateOtp() {
    const min = 100000,
      max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }
}
