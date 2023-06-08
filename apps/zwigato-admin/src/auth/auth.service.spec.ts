import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { DataSource } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";
import { ROLE_CONSTANT } from "../roleConstants";
import { async } from "rxjs";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { Exception } from "handlebars";
import { error } from "console";

const mockTaskRepo = () => ({});

describe("AuthService", () => {
  let authService: AuthService;
  let datasource;
  let jwtservice;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: "DataSource",
          useValue: {
            manager: {
              findOneBy: jest.fn(),
              findOne: jest.fn(),
              create: jest.fn(),
              save: jest.fn(),
            },
          },
        },
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: MailService, useValue: {} },
      ],
    }).compile();

    authService = module.get(AuthService);
    jwtservice = module.get(JwtService);
    datasource = module.get("DataSource");
  });

  it("should admin login ", async () => {
    datasource.manager.findOneBy.mockResolvedValue({
      adminPassword:
        "$2a$10$QXxi7PHztCBA/ysb.sBv6uCrXGyF3TJqEThmTmKLvDb9tqXfRxUHG",
    });

    jwtservice.signAsync.mockResolvedValue(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2NzcwMywiZXhwIjoxNjgyMTU0MTAzfQ.lw9hXqbL5tdlO9ODw3XFuFLZoR8RDGEpX-pKtbmfLzY"
    );

    const user = await authService.adminLogin({
      email: "parthitadara@gmail.com",
      password: "Parth@123",
    });
    expect(user).toEqual({
      status: true,
      message: "Login Done",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2NzcwMywiZXhwIjoxNjgyMTU0MTAzfQ.lw9hXqbL5tdlO9ODw3XFuFLZoR8RDGEpX-pKtbmfLzY",
    });
  });

  it("should not be adminlogin ", async () => {
    datasource.manager.findOneBy.mockResolvedValue({
      adminPassword:
        "$2a$10$QXxi7PHztCBA/ysb.sBv6uCrXGyF3TJqEThmTmKLvDb9tqXfRxUHG",
    });

    jwtservice.signAsync.mockResolvedValue(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2NzcwMywiZXhwIjoxNjgyMTU0MTAzfQ.lw9hXqbL5tdlO9ODw3XFuFLZoR8RDGEpX-pKtbmfLzY"
    );

    const user = await authService.adminLogin({
      email: "parthitadara@gmail.com",
      password: "Parth@13",
    });
    expect(user).toEqual({
      status: false,
      message: "Password is incoorect",
    });
  });

  it("should not present admin ", async () => {
    // datasource.manager.findOneBy.mockResolvedValue({
    //   adminPassword:
    //     '$2a$10$QXxi7PHztCBA/ysb.sBv6uCrXGyF3TJqEThmTmKLvDb9tqXfRxUHG',
    // });

    jwtservice.signAsync.mockResolvedValue(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2NzcwMywiZXhwIjoxNjgyMTU0MTAzfQ.lw9hXqbL5tdlO9ODw3XFuFLZoR8RDGEpX-pKtbmfLzY"
    );

    const user = await authService.adminLogin({
      email: "parthitdadaadara@gmail.com",
      password: "Parth@123",
    });

    expect(user).toEqual({
      status: false,
      message: "You are not registered. Please Register first",
    });
  });
  it("manager register", async () => {
    datasource.manager.create.mockResolvedValue();
    const managers = await authService.registerManager({
      managerName: "Raj",
      managerEmail: "kevaljoshi1306@gmail.com",
      managerPassword: "Raj@123",
      managerPhone: "7878787878",
      registerdAt: undefined,
    });
    expect(managers).toEqual({
      status: true,
      message: "you are registered wait till admin verify",
    });
  });

  it("manager already register", async () => {
    datasource.manager.save.mockResolvedValue();
    datasource.manager.findOneBy.mockResolvedValue({
      managerEmail: "kevaljoshi1306@gmail.com",
    });
    const managers = authService.registerManager({
      managerName: "Raj",
      managerEmail: "kevaljoshi1306@gmail.com",
      managerPassword: "Raj@123",
      managerPhone: "7878787878",
      registerdAt: new Date(),
    });
    expect(managers).rejects.toThrow(
      new BadRequestException("Unable to register you")
    );
  });

  it("manager already register withcode", async () => {
    datasource.manager.create.mockResolvedValue({});
    console.log();
    datasource.manager.save.mockRejectedValue({
      code: 23505,
    });

    datasource.manager.findOne.mockResolvedValue({
      managerName: "Raj",
      managerEmail: "ravi@gmail.com",
      managerPassword:
        "$2a$10$e.psj/ZIquz02zkQACUCq.4UOVKLuHNA3Qs9tGU1jCTDDrCHAho1q",
      managerPhone: "7878787878",
      registerdAt: "2023-04-28T06:35:06.569Z",
    });

    const mockJoinedDate = new Date();
    const registerDto = {
      managerName: "Raj",
      managerEmail: "ravi@gmail.com",
      managerPassword: "Raj@123",
      managerPhone: "7878787878",
      registerdAt: new Date("2023-04-28T06:35:06.569Z"),
    };
    const managers = authService.registerManager({ ...registerDto });
    expect(managers).rejects.toThrow(
      new ConflictException("You are already registered! Please login")
    );
  });

  it("manager login", async () => {
    datasource.manager.findOneBy.mockResolvedValue({
      managerPassword:
        "$2a$10$Oxb.olb.CHmPfyEnEHscI.sCgk20g4sRlId5FH3FqbxRVQB3DU8zq",
    });

    jwtservice.signAsync.mockResolvedValue(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2NzcwMywiZXhwIjoxNjgyMTU0MTAzfQ.lw9hXqbL5tdlO9ODw3XFuFLZoR8RDGEpX-pKtbmfLzY"
    );

    const user = await authService.loginManager({
      email: "rajsoni2k2@gmail.com",
      password: "Raj@123",
    });

    expect(user).toEqual({
      status: true,
      message: "Login Done",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2NzcwMywiZXhwIjoxNjgyMTU0MTAzfQ.lw9hXqbL5tdlO9ODw3XFuFLZoR8RDGEpX-pKtbmfLzY",
    });
  });

  it("manager failed to login", async () => {
    datasource.manager.findOneBy.mockResolvedValue({
      managerPassword:
        "$2a$10$Oxb.olb.CHmPfyEnEHscI.sCgk20g4sRlId5FH3FqbxRVQB3DU8zq",
    });

    jwtservice.signAsync.mockResolvedValue(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODM0ZWNjZDgtODgyNC00OWUzLWI0MjgtNTY5NjM4YWM3Y2ViIiwiZW1haWwiOiJwYXJ0aGl0YWRhcmFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4MjA2NzcwMywiZXhwIjoxNjgyMTU0MTAzfQ.lw9hXqbL5tdlO9ODw3XFuFLZoR8RDGEpX-pKtbmfLzY"
    );

    const user = await authService.loginManager({
      email: "rajsoni2k2@gmail.com",
      password: "Raj@13",
    });

    expect(user).toEqual({
      status: false,
      message: "password is incorrect",
    });
  });



  it("should not present manager ", async () => {
    // datasource.manager.findOneBy.mockResolvedValue({
    //   adminPassword:
    //     '$2a$10$QXxi7PHztCBA/ysb.sBv6uCrXGyF3TJqEThmTmKLvDb9tqXfRxUHG',
    // });
    const user = await authService.loginManager({
      email: "parthitdadaadara@gmail.com",
      password: "Parth@123",
    });

    expect(user).toEqual({
      status: false,
      message: "You are not registered. Please Register first",
    });
  });
});
