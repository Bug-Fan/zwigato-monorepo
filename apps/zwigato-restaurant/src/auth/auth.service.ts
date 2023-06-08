import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Restaurant } from 'src/database/entities/restaurant.entity';
import { DataSource, EntityManager, IsNull, Not } from 'typeorm';
import { RestaurantSignUpDto } from './dto/request/restaurantSignUp.dto';
import { RestaurantSignUpResDto } from './dto/response/restaurantSignUp.res.dto';
import * as bcrypt from 'bcryptjs';
import { RestaurantSignInDto } from './dto/request/restaurantSignIn.dto';
import { RestaurantSignInResDto } from './dto/response/restaurantSignIn.res.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { RestaurantType } from 'src/database/entities/restaurantType.entity';
import {
  EmailService,
  MyMailOptions,
  EmailSubjects,
  EmailResponse,
} from 'src/email/email.service';
import { VerifyOtoDto } from './dto/request/verifyOtp.dto';
import { SuccessEmailVerificationDTO } from './dto/response/emailverification.res.dto';
import { CommonResDto } from 'src/dto/commonResponse.dto';

@Injectable()
export class AuthService {
  private manager: EntityManager;
  constructor(
    @Inject('DataSource') datasource: DataSource,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {
    this.manager = datasource.manager;
  }

  generateOTP() {
    const min = 100000,
      max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  async verifyOTP(otp: VerifyOtoDto) {
    const { email, OTP } = otp;
    let restaurantData: Restaurant;
    try {
      restaurantData = await this.manager.findOneBy(Restaurant, {
        restaurantEmail: email,
        OTP: Not(IsNull()),
      });
      if (restaurantData)
        if (restaurantData.OTP == OTP) {
          let verifyEmail = await this.manager.update(
            Restaurant,
            restaurantData.restaurantId,
            { isEmailVerified: true, OTP: null },
          );
          return new SuccessEmailVerificationDTO(
            `OTP verification has been completed for user ${email}`,
          );
        } else throw new BadRequestException('Invalid OTP');
      else {
        throw new BadRequestException('OTP has been expired or already used.');
      }
    } catch (error) {
      if (error.status && error.status === 400)
        throw new BadRequestException(error.message);
      else throw new BadGatewayException('Unable to Verify Otp');
    }
  }

  async cancelSignUp(id: string) {
    let verify = await this.manager.findOneBy(Restaurant, { restaurantId: id });
    if (verify.isEmailVerified == false) {
      await this.manager.delete(Restaurant, { restaurantId: id });
    }
  }

  async restaurantSignUp(
    data: RestaurantSignUpDto,
    logo,
    passBook,
  ): Promise<RestaurantSignUpResDto> {
    let { restaurantPassword } = data;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(restaurantPassword, salt);
    data = Object.assign(
      {
        logoPath: logo,
        passBookImagePath: passBook,
        OTP: this.generateOTP(),
      },
      data,
    );
    data.restaurantPassword = hashPassword;
    let restaurantData = this.manager.create(Restaurant, data);
    try {
      const restaurant = await this.manager.save(Restaurant, restaurantData);
      await this.emailService.send(
        new MyMailOptions(
          restaurantData.restaurantEmail,
          EmailSubjects.OTP_SENT,
          EmailResponse.OTP_RESPONSE,
          {
            OTP: restaurant.OTP,
            restaurantName: restaurantData.restaurantName,
          },
        ),
      );

      setTimeout(() => {
        this.cancelSignUp(restaurant.restaurantId);
      }, 120000);

      return new CommonResDto(false,'Registration SucssesFully...');
    } catch (error) {
      if (error.code && error.code == 23505)
        throw new ConflictException('You are already registered! Please login');
      else if (error.code && error.code == 23503)
        throw new BadRequestException('Restaurant type not found');
      else throw new BadRequestException('Unable to register you');
    }
  }

  async restaurantSignIn(
    data: RestaurantSignInDto,
  ): Promise<RestaurantSignInResDto> {
    const { restaurantEmail, restaurantPassword } = data;
    let restaurantData: Restaurant;
    try {
      restaurantData = await this.manager.findOneBy(Restaurant, {
        restaurantEmail,
        isEmailVerified: true,
        isVerified: true,
        isDeleted: false,
      });
    } catch (error) {
      throw new BadGatewayException('Unable to login you');
    }
    if (restaurantData) {
      const isEqual = await bcrypt.compare(
        restaurantPassword,
        restaurantData.restaurantPassword,
      );
      if (isEqual) {
        const payload: JwtPayload = {
          restaurantId: restaurantData.restaurantId,
        };
        const accessToken: string = await this.jwtService.sign(payload);
        return new RestaurantSignInResDto(
          false,
          'Login Successfully',
          accessToken,
        );
      } else throw new BadRequestException('Invalid credentials');
    } else {
      throw new BadRequestException(
        `User doesn't exsits or Email Varification Pending or Admin Varification Pending`,
      );
    }
  }

  async getRestaurantTypes(): Promise<RestaurantType[]> {
    return await this.manager.find(RestaurantType);
  }
}
