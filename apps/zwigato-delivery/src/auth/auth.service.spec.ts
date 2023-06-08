import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { DataSource } from 'typeorm';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { OtpRequestDto } from './dto/request/otp.request.dto';
import { RegisterRequestDto } from './dto/request/register.request.dto';

describe('authService', () => {
  let authService: AuthService;
  let dataSource;
  let jwtService;
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
          provide: MailService,
          useValue: {},
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    dataSource = module.get<DataSource>('DataSource');
    jwtService = module.get<JwtService>(JwtService);
  });

  //admin login
  it('should be defined', async () => {
    dataSource.manager.findOneBy.mockResolvedValue({
      adminPassword:
        '$2a$10$QXxi7PHztCBA/ysb.sBv6uCrXGyF3TJqEThmTmKLvDb9tqXfRxUHG',
    });

    jwtService.signAsync.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2Njc5OSwiZXhwIjoxNjgyMTA5OTk5fQ.z6eJY0h0KWIl5RESppiTShaYwV-cgLnscRkNk33DUCI',
    );

    expect(
      await authService.adminLogin({
        email: 'parthitadara@gmail.com',
        password: 'Parth@123',
      }),
    ).toBeInstanceOf(LoginResponseDto);
  });

  it('should not be able to login', async () => {
    dataSource.manager.findOneBy.mockResolvedValue({
      adminPassword:
        '$2a$10$QXxi7PHztCBA/ysb.sBv6uCrXGyF3TJqEThmTmKLvDb9tqXfRxUHG',
    });

    jwtService.signAsync.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2Njc5OSwiZXhwIjoxNjgyMTA5OTk5fQ.z6eJY0h0KWIl5RESppiTShaYwV-cgLnscRkNk33DUCI',
    );

    expect(
      await authService.adminLogin({
        email: 'parthitadara@gmail.com',
        password: 'Parth@1233',
      }),
    ).toEqual(new LoginResponseDto(false, 'Password is incoorect'));
  });

  it('should not be able to login', async () => {
    jwtService.signAsync.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2Njc5OSwiZXhwIjoxNjgyMTA5OTk5fQ.z6eJY0h0KWIl5RESppiTShaYwV-cgLnscRkNk33DUCI',
    );

    expect(
      await authService.adminLogin({
        email: 'parthitadara@gmail.com',
        password: 'Parth@1233',
      }),
    ).toEqual(
      new LoginResponseDto(
        false,
        'You are not registered. Please Register first',
      ),
    );
  });

  //deliveryAgent login
  it('should be login', async () => {
    dataSource.manager.findOneBy.mockResolvedValue({
      agentPassword:
        '$2a$10$2C5MxcAMmUrkRmS73xgndeINs9aWLP1aBaV4O8nn2t3TP01FH57Lq',
    });

    jwtService.signAsync.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiMDRhNGU1ZGQtN2U3Yi00MzA1LWIwMWQtNjZjNGQ1YTYyYTljIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkRlbGl2ZXJ5QWdlbnQifSwiaWF0IjoxNjgyMzA1NDQ3LCJleHAiOjE2ODIzNDg2NDd9.anYjQy0x8WSbqJj12Zr6wjiIroShxyi2pFX8SJPtwkk',
    );

    expect(
      await authService.deliveryAgentLogin({
        email: 'parthitadara@gmail.com',
        password: 'Parth@123',
      }),
    ).toBeInstanceOf(LoginResponseDto);
  });

  it('should not be able to login', async () => {
    dataSource.manager.findOneBy.mockResolvedValue({
      agentPassword:
        '$2a$10$2C5MxcAMmUrkRmS73xgndeINs9aWLP1aBaV4O8nn2t3TP01FH57Lq',
    });

    jwtService.signAsync.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiMDRhNGU1ZGQtN2U3Yi00MzA1LWIwMWQtNjZjNGQ1YTYyYTljIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkRlbGl2ZXJ5QWdlbnQifSwiaWF0IjoxNjgyMzA1NDQ3LCJleHAiOjE2ODIzNDg2NDd9.anYjQy0x8WSbqJj12Zr6wjiIroShxyi2pFX8SJPtwkk',
    );

    expect(
      await authService.deliveryAgentLogin({
        email: 'parthitadara@gmail.com',
        password: 'Parth@1234',
      }),
    ).toEqual(new LoginResponseDto(false, 'password is incorrect'));
  });

  it('should not be able to login', async () => {
    jwtService.signAsync.mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiMDRhNGU1ZGQtN2U3Yi00MzA1LWIwMWQtNjZjNGQ1YTYyYTljIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkRlbGl2ZXJ5QWdlbnQifSwiaWF0IjoxNjgyMzA1NDQ3LCJleHAiOjE2ODIzNDg2NDd9.anYjQy0x8WSbqJj12Zr6wjiIroShxyi2pFX8SJPtwkk',
    );

    expect(
      await authService.deliveryAgentLogin({
        email: 'parthitadara@gmail.com',
        password: 'Parth@1233',
      }),
    ).toEqual(
      new LoginResponseDto(
        false,
        'You are not registered. Please Register first',
      ),
    );
  });

  describe('it should return login dto', () => {
    let logindto: LoginRequestDto;

    beforeEach(() => {
      logindto = new LoginRequestDto();
    });

    it('should be defined', () => {
      expect(logindto).toBeDefined();
    });

    it('email id should not be string', async () => {
      let data = {
        email: 544,
        password: 23,
      };

      const ofImportDto = plainToInstance(LoginRequestDto, data);
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isEmail).toContain('email must be an email');
      expect(error[0].constraints.maxLength).toContain(
        'email must be shorter than or equal to 50 characters',
      );
      expect(error[1].constraints.matches).toContain(
        'password must match /((?=.*d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/ regular expression',
      );
      expect(error[1].constraints.maxLength).toContain(
        'password must be shorter than or equal to 50 characters',
      );
      expect(error[1].constraints.isString).toContain(
        'password must be a string',
      );
    });
  });

  describe('it should give otp dto', () => {
    let otpdto: OtpRequestDto;
    beforeEach(() => {
      otpdto = new OtpRequestDto();
    });

    it('should be defined', () => {
      expect(otpdto).toBeDefined();
    });

    it('otp should not be string', async () => {
      let data = {
        agentEmail: '',
        OTP: '',
      };
      const ofImportDto = plainToInstance(OtpRequestDto, data);
      const error = await validate(ofImportDto);
      expect(error[0].constraints.isNotEmpty).toContain(
        'agentEmail should not be empty',
      );
      expect(error[1].constraints.isNotEmpty).toContain(
        'OTP should not be empty',
      );
    });
  });

  describe('it should give register request dto', () => {
    let registerdto: RegisterRequestDto;
    beforeEach(() => {
      registerdto = new RegisterRequestDto();
    });

    it('should be defined', () => {
      expect(registerdto).toBeDefined();
    });

    it('should give register request dto', async () => {
      let data = {
        agentName: 1,
        agentEmail: 2,
        agentPassword: 3,
        agentProfilePath: 4,
        agentAddressLine1: 5,
        agentAddressLine2: 6,
        pincode: 7,
        city: 8,
        state: 9,
        agentLatitude: 10,
        agentLongitude: 11,
        agentPhone: 12,
        adharcardImagePath: 13,
        isDeposited: 14,
        licenceImagePath: 15,
        adharcardNumber: 16,
        licenceNumber: 17,
        vehicaleNumber: 18,
        agentRCBookImagePath: 19,
        passBookImagePath: 20,
        bankName: 21,
        bankIFSC: 22,
        bankAccountNumber: 23,
        tshirtSize: 24,
        jobType: 25,
        registerdAt: 26,
      };
      const ofImportDto = plainToInstance(RegisterRequestDto, data);
      const error = await validate(ofImportDto);
      expect(error[0].constraints.isString).toContain(
        'agentName must be a string',
      );
      expect(error[1].constraints.isEmail).toContain(
        'agentEmail must be an email',
      );
      expect(error[1].constraints.maxLength).toContain(
        'agentEmail must be shorter than or equal to 50 characters',
      );
      expect(error[2].constraints.matches).toContain(
        'agentPassword must match /((?=.*d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/ regular expression',
      );
      expect(error[2].constraints.maxLength).toContain(
        'agentPassword must be shorter than or equal to 50 characters',
      );
      expect(error[2].constraints.isString).toContain(
        'agentPassword must be a string',
      );
      expect(error[3].constraints.isString).toContain(
        'agentAddressLine1 must be a string',
      );
      expect(error[4].constraints.isString).toContain(
        'agentAddressLine2 must be a string',
      );
      expect(error[5].constraints.isString).toContain(
        'pincode must be a string',
      );
      expect(error[6].constraints.isString).toContain('city must be a string');
      expect(error[7].constraints.isString).toContain('state must be a string');
      expect(error[8].constraints.isString).toContain(
        'agentPhone must be a string',
      );
      expect(error[9].constraints.isString).toContain(
        'adharcardNumber must be a string',
      );
      expect(error[10].constraints.isString).toContain(
        'licenceNumber must be a string',
      );
      expect(error[11].constraints.isString).toContain(
        'vehicaleNumber must be a string',
      );
      expect(error[12].constraints.isString).toContain(
        'bankName must be a string',
      );
      expect(error[13].constraints.isString).toContain(
        'bankIFSC must be a string',
      );
      expect(error[14].constraints.isString).toContain(
        'bankAccountNumber must be a string',
      );
      expect(error[15].constraints.isEnum).toContain(
        'tshirtSize must be one of the following values: S, M, L, XL, XXL, XXXL',
      );
      expect(error[16].constraints.isEnum).toContain(
        'jobType must be one of the following values: FULL_TIME, PART_TIME',
      );
    });
  });
});
