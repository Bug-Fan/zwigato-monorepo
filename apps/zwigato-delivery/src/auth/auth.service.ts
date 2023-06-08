import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Admin } from '../db/entities/admin.entity';
import { ROLE_CONSTANT } from '../roleConstant';
import { DataSource, EntityManager } from 'typeorm';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { JwtPayload } from './jwt.payload.interface';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { RegisterResponseDto } from './dto/response/register.response.dto';
import { DeliveryAgent } from '../db/entities/deliveryAgent.entity';
import {
  EmailResponse,
  EmailSubjects,
  MailService,
  MyMailOptions,
} from '../mail/mail.service';
import { OtpRequestDto } from './dto/request/otp.request.dto';
import { OtpResponseDto } from './dto/response/otp.response.dto';
@Injectable()
export class AuthService {
  private manager: EntityManager;
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private mailservice: MailService,
    private jwtService: JwtService,
  ) {
    this.manager = this.dataSource.manager;
  }
  async adminLogin(loginAdmin: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = loginAdmin;
    const id = '834eccd8-8824-49e3-b428-569638ac7ceb';
    // const key = this.configs.get<string>('JWT_SECRET_KEY');

    try {
      const admin = await this.manager.findOneBy(Admin, { adminEmail: email });

      if (admin) {
        const adminId = admin.adminId;
        if (admin && (await bcrypt.compare(password, admin.adminPassword))) {
          const role = ROLE_CONSTANT.ROLES.ADMIN;
          const payload: JwtPayload = { id, email: email, role };
          const token: string = await this.jwtService.signAsync({ payload });
          return new LoginResponseDto(true, 'Login Done', token);
        } else {
          return new LoginResponseDto(false, 'Password is incoorect');
        }
      }
      if (!admin) {
        return new LoginResponseDto(
          false,
          'You are not registered. Please Register first',
        );
      }
    } catch (error) {
      throw new HttpException(
        'Not Able to login please try again',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deliveryAgentRegister(
    registerDeliveryAgent: RegisterRequestDto,
    adharcard,
    licence,
    agentProfile,
    agentRCBook,
    passBook,
  ): Promise<RegisterResponseDto> {
    const { agentPassword } = registerDeliveryAgent;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(agentPassword, salt);
    const OTP = this.generateOtp();
    const joinedDate = new Date();

    console.log(joinedDate);

    registerDeliveryAgent = Object.assign(
      {
        adharcardImagePath: adharcard,
        licenceImagePath: licence,
        agentProfilePath: agentProfile,
        agentRCBookImagePath: agentRCBook,
        passBookImagePath: passBook,
        OTP,
        joinedDate,
      },
      registerDeliveryAgent,
    );

    registerDeliveryAgent.agentPassword = hashPassword;
    const deliveryRegister = this.manager.create(
      DeliveryAgent,
      registerDeliveryAgent,
    );

    try {
      if (deliveryRegister) {
        await this.manager.save(DeliveryAgent, deliveryRegister);
        this.mailservice.verificationEmail(
          new MyMailOptions(
            registerDeliveryAgent.agentEmail,
            EmailSubjects.OTPSENDDELIVERYAGENT,
            EmailResponse.OTP_SEND,
            { OTP },
          ),
        );
        const response = new RegisterResponseDto(
          true,
          'kindly please check your mail for otp',
        );
        return response;
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      if (error.code && error.code == 23505)
        throw new ConflictException('You are already registered! Please login');
      else throw new BadRequestException('Unable to register you');
    }
  }

  async verifyAgent(agentOtp: OtpRequestDto): Promise<OtpResponseDto> {
    const { OTP, agentEmail } = agentOtp;

    try {
      const agent = await this.dataSource.manager.findOne(DeliveryAgent, {
        where: {
          agentEmail,
          isEmailVerified: false,
        },
      });
      if (agent && agent.OTP === OTP) {
        const verifiedUser = await this.dataSource.manager.update(
          DeliveryAgent,
          { agentEmail },
          { isEmailVerified: true },
        );
        if (verifiedUser.affected === 1) {
          this.mailservice.verificationEmail(
            new MyMailOptions(
              agentOtp.agentEmail,
              EmailSubjects.AGENTREGISTERED,
              EmailResponse.AGENTREGISTERED,
              { agentEmail },
            ),
          );

          return new OtpResponseDto(
            true,
            'Your registration is successfull, Welcome to zwigato.',
          );
        } else {
          throw new BadGatewayException();
        }
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      if (error.status === 502) {
        new BadGatewayException('Unable to register you.');
      } else if (error.status === 400) {
        throw new BadRequestException(
          'You are not registered, or your entered otp is incorrect.',
        );
      } else {
        console.log(error);
      }
    }
  }

  async deliveryAgentLogin(
    loginDeliveryAgent: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const { email, password } = loginDeliveryAgent;
    // console.log(loginDeliveryAgent);
    // console.log(email, password);
    try {
      const agent = await this.manager.findOneBy(DeliveryAgent, {
        agentEmail: email,
        isVerified: true,
        isDeposited: true,
        isEmailVerified: true,
        isDeleted: false,
      });

      if (agent) {
        const agentid = agent.agentId;
        if (agent && (await bcrypt.compare(password, agent.agentPassword))) {
          const role = ROLE_CONSTANT.ROLES.DELIVERYAGENT;
          // console.log(role);
          const payload: JwtPayload = { id: agent.agentId, email, role };
          // console.log(payload);
          const token: string = await this.jwtService.signAsync({ payload });
          return new LoginResponseDto(true, 'Login Done', token);
        } else {
          return new LoginResponseDto(false, 'password is incorrect');
        }
      }
      if (!agent) {
        return new LoginResponseDto(
          false,
          'You are not registered. Please Register first',
        );
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Not Able to login please try again',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  generateOtp() {
    const min = 10000,
      max = 99999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }
}
