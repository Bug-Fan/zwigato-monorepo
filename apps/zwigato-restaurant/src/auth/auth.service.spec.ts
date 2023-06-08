import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { DataSource } from 'typeorm';
import { RestaurantSignInResDto } from './dto/response/restaurantSignIn.res.dto';
import { BadRequestException } from '@nestjs/common';
import { RestaurantSignUpResDto } from './dto/response/restaurantSignUp.res.dto';
import { CommonResDto } from 'src/dto/commonResponse.dto';

describe('Auth service', () => {
  let authservice: AuthService;
  let dataSource;
  let jwtservice;
  let emailService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
              save: jest.fn(),
              findOneBy: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: { send: jest.fn() },
        },
      ],
    }).compile();

    dataSource = module.get<DataSource>('DataSource');
    authservice = module.get<AuthService>(AuthService);
    jwtservice = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should  able to login', async () => {
    dataSource.manager.findOneBy.mockResolvedValue({
      restaurantPassword:
        '$2a$10$rwsQY6/gA3T.5VRJzOukU.0O.E3ZOCiwpsotfDMoD/MLdLEOqA1c2',
    });
    jwtservice.sign.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );

    expect(
      await authservice.restaurantSignIn({
        restaurantEmail: 'bhavyampatel25@gmail.com',
        restaurantPassword: '1234',
      }),
    ).toStrictEqual(
      new RestaurantSignInResDto(
        false,
        'Login Successfully',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ),
    );
  });

  it('should not be able to login', async () => {
    dataSource.manager.findOneBy.mockResolvedValue({
      restaurantPassword:
        '$2a$10$rwsQY6/gA3T.5VRJzOukU.0O.E3ZOCiwpsotfDMoD/MLdLEOqA1c2',
    });

    jwtservice.sign.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );

    expect(
      authservice.restaurantSignIn({
        restaurantEmail: 'bhavyampatel25@gmail.com',
        restaurantPassword: '14',
      }),
    ).rejects.toThrow(new BadRequestException('Invalid credentials'));
  });

  it('should not be able to login', async () => {
    jwtservice.sign.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );

    expect(
      authservice.restaurantSignIn({
        restaurantEmail: 'bhavyampatel25@gmail.com',
        restaurantPassword: '14',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not be able to login', async () => {
    expect(
      authservice.restaurantSignIn({
        restaurantEmail: 'bhavyampatel25@gmail.com',
        restaurantPassword: '14',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('Should register user', async () => {
    emailService.send.mockResolvedValue('');
    dataSource.manager.create.mockResolvedValue({
      logoPath: '1682078656549-imageedit_1_7515640712.png',
      passBookImagePath: '1682078656554-imageedit_1_7515640712.png',
      OTP: '829977',
      restaurantName: 'Kaka ni Bhaji PAV',
      restaurantTypeId: 6,
      restaurantAddressLine1: 'Nana chiloda circle',
      restaurantAddressLine2: '',
      pincode: '382330',
      city: 'Ahmedabad',
      state: 'gujrat',
      restaurantLatitude: '23.068586',
      restaurantLongitude: '72.653595',
      restaurantEmail: 'grabopportunity82@gmail.com',
      restaurantPassword: '1234',
      restaurantPhone: '6351884585',
      managerName: 'Keval',
      pancard: '212655465565',
      gstNumber: 'nbkjjkscjklcsklj',
      fssai: '32522355865',
      bankName: '28823884242',
      bankIFSC: '424242424242',
      bankAccountNumber: 'fwwfwfwrrwrw',
    });
    dataSource.manager.save.mockResolvedValue({ restaurantEmail: '' });
    expect(
      await authservice.restaurantSignUp(
        {
          logoPath: '1682078656549-imageedit_1_7515640712.png',
          passBookImagePath: '1682078656554-imageedit_1_7515640712.png',
          restaurantName: 'Kaka ni Bhaji PAV',
          restaurantTypeId: 6,
          restaurantAddressLine1: 'Nana chiloda circle',
          restaurantAddressLine2: '',
          pincode: '382330',
          city: 'Ahmedabad',
          state: 'gujrat',
          restaurantLatitude: '23.068586',
          restaurantLongitude: '72.653595',
          restaurantEmail: 'grabopportunity82@gmail.com',
          restaurantPassword: '1234',
          restaurantPhone: '6351884585',
          managerName: 'Keval',
          pancard: '212655465565',
          gstNumber: 'nbkjjkscjklcsklj',
          fssai: '32522355865',
          bankName: '28823884242',
          bankIFSC: '424242424242',
          bankAccountNumber: 'fwwfwfwrrwrw',
        },
        '1',
        '2',
      ),
    ).toStrictEqual(new CommonResDto(false, 'Registration SucssesFully...'));
  });

  it('should generate OTP', () => {
    expect(authservice.generateOTP()).toHaveLength(6);
  });
});
