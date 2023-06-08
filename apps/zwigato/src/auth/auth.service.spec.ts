import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { EmailService } from 'src/email/email.service';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { CustomerRegistrationRequestDto } from './dto/req/customer.registration.request.dto';
import { RegistrationResponseDto } from './dto/res/registration.response.dto';
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CustomerOtpRequestDto } from './dto/req/customer.otp.request.dto';
import { Customer } from 'src/db/entities/customer.entity';
import { VerificationResponseDto } from './dto/res/verification.response.dto';
import { faker } from '@faker-js/faker';
import { CustomerLoginRequestDto } from './dto/req/customer.login.request.dto';
import { LoginResponseDto } from './dto/res/login.response.dto';
import { unlink } from 'fs';

describe('AuthService', () => {
  let authService: AuthService;
  let dataSource;
  let jwtService;
  let emailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'DataSource',
          useValue: {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            release: jest.fn(),
            rollbackTransaction: jest.fn(),
            manager: {
              find: jest.fn(),
              findOne: jest.fn(),
              insert: jest.fn(),
              update: jest.fn(),
              findOneBy: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    dataSource = module.get<DataSource>('DataSource');
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  describe('registerCustomer', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const registerDto: CustomerRegistrationRequestDto = {
      customerEmail: 'abcitadara@gmail.com',
      customerName: 'Pintu',
      customerPassword: '123456',
      customerPhone: '1236547890',
      profilePath: 'abc.png',
    };

    it('it should registerCustomer', async () => {
      dataSource.manager.insert.mockResolvedValue({ identifiers: ['abc'] });
      expect(
        await authService.registerCustomer(registerDto, 'abc.png'),
      ).toStrictEqual(
        new RegistrationResponseDto(
          false,
          'We have sent an OTP on your email address, please verify OTP to complete registration process.',
        ),
      );
    });

    it('conflict message', async () => {
      dataSource.manager.insert.mockRejectedValue({ code: 23505 });

      await expect(
        authService.registerCustomer(registerDto, 'abc.png'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw a BadGatewayException if an error occurs during registration', async () => {
      await expect(
        authService.registerCustomer(registerDto, 'abc.png'),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('verify Otp', () => {
    const customerOtp: CustomerOtpRequestDto = {
      customerEmail: 'abc@gmail.com',
      OTP: '235064',
    };

    it('otp incorrect', () => {
      const customer: Customer = {
        customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
        cart: [],
        userCoupon: [],
        order: [],
        address: [],
        customerName: 'abcder',
        customerEmail: 'abc@gmail.com',
        customerPassword: 'manhhsdkhfd@-bakfvhqoufgjlf-vjfjjk',
        customerPhone: '7896541230',
        profilePath: 'abc.jpg',
        OTP: '235063',
        isEmailVerified: false,
        registerdAt: undefined,
        monthOrderValue: 0,
      };
      dataSource.manager.findOne.mockResolvedValue(customer);
      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      const result = authService.verifyCustomer(customerOtp);

      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should verify otp', async () => {
      const customer: Customer = {
        customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
        cart: [],
        userCoupon: [],
        order: [],
        address: [],
        customerName: 'abcder',
        customerEmail: 'abc@gmail.com',
        customerPassword: 'manhhsdkhfd@-bakfvhqoufgjlf-vjfjjk',
        customerPhone: '7896541230',
        profilePath: 'abc.jpg',
        OTP: '235064',
        isEmailVerified: false,
        registerdAt: undefined,
        monthOrderValue: 0,
      };
      dataSource.manager.findOne.mockResolvedValue(customer);
      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      const result = await authService.verifyCustomer(customerOtp);

      expect(result).toStrictEqual(
        new VerificationResponseDto(
          false,
          'Your registration is successfull, Welcome to zwigato.',
        ),
      );
    });

    it('should return bad gateway', () => {
      const customer: Customer = {
        customerId: faker.datatype.uuid(),
        cart: [],
        userCoupon: [],
        order: [],
        address: [],
        customerName: faker.name.firstName(),
        customerEmail: faker.internet.email(),
        customerPassword: faker.internet.password(),
        customerPhone: faker.phone.number('+91 ##### #####'),
        profilePath: faker.system.commonFileName('png|jpg|jpeg'),
        OTP: '235064',
        isEmailVerified: false,
        registerdAt: undefined,
        monthOrderValue: 0,
      };
      dataSource.manager.findOne.mockResolvedValue(customer);
      dataSource.manager.update.mockResolvedValue({ affected: 0 });

      const result = authService.verifyCustomer(customerOtp);
      expect(result).rejects.toThrow(BadGatewayException);
    });

    it('should return not found exception', () => {
      dataSource.manager.update.mockResolvedValue({ affected: 0 });

      const result = authService.verifyCustomer(customerOtp);
      expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('login customer', () => {
    const loginCustomerDto: CustomerLoginRequestDto = {
      customerEmail: 'abc@gmail.com',
      customerPassword: 'abcdef',
    };
    it('should login', async () => {
      dataSource.manager.findOne.mockResolvedValue({
        customerPassword:
          '$2b$10$miZUhLzqNResYpahQazuMuzYMheTKeANOQg8iCWnUoKLdHICL67x2',
      });
      jwtService.signAsync.mockResolvedValue(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcklkIjoiYTZkZjhlNTAtOTJjMC00ODlkLWI2MTItMjY0MGZmMDhjNjQwIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODI1MDM0NDksImV4cCI6MTY4MjUwNzA0OX0.kB_rq8gob3tdpiCU5xNX1WTGz09e-5NUrrOyFPyieRk',
      );
      const result = await authService.loginCustomer(loginCustomerDto);
      expect(result).toBeInstanceOf(LoginResponseDto);
    });

    it('not found customer', () => {
      dataSource.manager.findOne.mockRejectedValue({ status: 404 });
      const result = authService.loginCustomer(loginCustomerDto);

      expect(result).rejects.toThrow(NotFoundException);
    });

    it('return bad request exception', () => {
      dataSource.manager.findOne.mockResolvedValue({
        customerPassword:
          '$2b$10$miZUhLzqNResYpahQazuMuzYMheTKeANOQg8iCWnUoKLdHICL67x',
      });

      const result = authService.loginCustomer(loginCustomerDto);
      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should return bad gateway', () => {
      //test
      dataSource.manager.findOne.mockRejectedValueOnce(new Error());

      const result = authService.loginCustomer(loginCustomerDto);
      expect(result).rejects.toThrow(BadGatewayException);
    });
  });

  describe('generate otp, helper function for generate otp', () => {
    it('should generate otp', () => {
      // const min = 100000;
      // const max = 999999;

      // const mockMath = Object.create(global.Math);
      // const expectedReponse = String(
      //   mockMath.floor(mockMath.random() * (max - min + 1)) + min,
      // );
      // global.Math = mockMath;
      expect(authService.generateOtp()).toHaveLength(6);
    });
  });

  describe('cancel registration', () => {
    const customerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';

    const customer: Customer = {
      customerId: customerId,
      cart: [],
      userCoupon: [],
      order: [],
      address: [],
      customerName: faker.name.firstName(),
      customerEmail: faker.internet.email(),
      customerPassword: faker.internet.password(),
      customerPhone: faker.phone.number('+91 ##### #####'),
      profilePath: faker.system.commonFileName('png|jpg|jpeg'),
      OTP: '235064',
      isEmailVerified: false,
      registerdAt: undefined,
      monthOrderValue: 0,
    };

    it('should be cancel the registration', async () => {
      dataSource.manager.findOneBy.mockResolvedValue(customer);
      dataSource.manager.delete.mockResolvedValue({ affected: 1 });

      const result = authService.cancelRegistration(
        customerId,
        customer.profilePath,
      );
      expect(result);
    });

    it('should return bad gateway', () => {
      //test
      dataSource.manager.findOneBy.mockRejectedValue(new Error());

      const result = authService.cancelRegistration(
        customerId,
        customer.profilePath,
      );
      expect(result).rejects.toThrow(BadGatewayException);
    });
  });
});
