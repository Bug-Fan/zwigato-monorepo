import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Admin } from "src/db/entities/admin.entity";
import { DataSource, EntityManager } from "typeorm";
import { LoginRequestDto } from "./dto/request/login.request.dto";
import { LoginResponseDto } from "./dto/response/login.response.dto";
import { JwtPayload } from "./jwt.payload.interface";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import {
  EmailResponse,
  EmailSubjects,
  MailService,
  MyMailOptions,
} from "src/mail/mail.service";
import { RegisterRequestDto } from "./dto/request/register.request.dto";
import { RegisterResponseDto } from "./dto/response/register.response.dto";
import { Manager } from "src/db/entities/manager.entity";
import { ROLE_CONSTANT } from "src/roleConstants";

@Injectable()
export class AuthService {
  private manager: EntityManager;
  constructor(
    @Inject("DataSource") private dataSource: DataSource,
    private mailservice: MailService,
    private jwtService: JwtService
  ) {
    this.manager = this.dataSource.manager;
  }

  async adminLogin(loginAdmin: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = loginAdmin;
    console.log("Login", loginAdmin);
    const id = "834eccd8-8824-49e3-b428-569638ac7ceb";
    // const key = this.configs.get<string>('JWT_SECRET_KEY');
    console.log(email, password);
    try {
      const admin = await this.manager.findOneBy(Admin, { adminEmail: email });
      if (admin) {
        const adminId = admin.adminId;
        if (admin && (await bcrypt.compare(password, admin.adminPassword))) {
          const role = ROLE_CONSTANT.ROLES.ADMIN;
          const payload: JwtPayload = { id, email: email, role };
          const token: string = await this.jwtService.signAsync({ payload });
          return new LoginResponseDto(true, "Login Done", token);
        } else {
          return new LoginResponseDto(false, "Password is incoorect");
        }
      }
      if (!admin) {
        return new LoginResponseDto(
          false,
          "You are not registered. Please Register first"
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async registerManager(
    managerRegister: RegisterRequestDto
  ): Promise<RegisterResponseDto> {
    const { managerPassword } = managerRegister;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(managerPassword, salt);
    const joinedDate = new Date();

    managerRegister = Object.assign(
      {
        joinedDate,
      },
      managerRegister
    );

    managerRegister.managerPassword = hashPassword;
    const registerManager = this.manager.create(Manager, managerRegister);
    try {
      if (registerManager) {
        await this.manager.save(Manager, registerManager);
        const response = new RegisterResponseDto(
          true,
          "you are registered wait till admin verify"
        );
        return response;
      } else {
        throw new BadRequestException("Unable to register you");
      }
    } catch (error) {
      if (error.code && error.code == 23505)
        throw new ConflictException("You are already registered! Please login");
      else throw new BadRequestException(error.message);
    }
  }

  async loginManager(
    loginDeliveryAgent: LoginRequestDto
  ): Promise<LoginResponseDto> {
    const { email, password } = loginDeliveryAgent;
    // console.log(loginDeliveryAgent);
    // console.log(email, password);
    try {
      const manager = await this.manager.findOneBy(Manager, {
        managerEmail: email,
        // isVerified: true,
        // isDeposited: true,
        // isEmailVerified: true,
        // isDeleted: false,
      });

      if (manager) {
        const managerid = manager.managerId;
        if (
          manager &&
          (await bcrypt.compare(password, manager.managerPassword))
        ) {
          const role = ROLE_CONSTANT.ROLES.MANAGER;
          // console.log(role);
          const payload: JwtPayload = { id: manager.managerId, email, role };
          // console.log(payload);
          const token: string = await this.jwtService.signAsync({ payload });
          return new LoginResponseDto(true, "Login Done", token);
        } else {
          return new LoginResponseDto(false, "password is incorrect");
        }
      }
      if (!manager) {
        return new LoginResponseDto(
          false,
          "You are not registered. Please Register first"
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
