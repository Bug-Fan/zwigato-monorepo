import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CustomerLoginRequestDto } from './dto/req/customer.login.request.dto';
import { CustomerOtpRequestDto } from './dto/req/customer.otp.request.dto';
import { CustomerRegistrationRequestDto } from './dto/req/customer.registration.request.dto';
import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginResponseDto } from './dto/res/login.response.dto';
import { RegistrationResponseDto } from './dto/res/registration.response.dto';
import { VerificationResponseDto } from './dto/res/verification.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registercustomer')
  @ApiBody({ type: CustomerRegistrationRequestDto })
  @ApiOkResponse({
    description: 'Otp sent',
  })
  @ApiConflictResponse({
    description: 'User already registered.',
  })
  @ApiBadGatewayResponse({
    description: 'Unable to register.',
  })
  @UseInterceptors(FileInterceptor('profile'))
  async registerUser(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpg|png)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    profile: Express.Multer.File,
    @Body() registerCustomerDto: CustomerRegistrationRequestDto,
  ): Promise<RegistrationResponseDto> {
    return await this.authService.registerCustomer(
      registerCustomerDto,
      profile,
    );
  }

  @Patch('verifycustomer')
  @ApiBody({ type: CustomerOtpRequestDto })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
  })
  @ApiNotFoundResponse({ description: 'User not registered.' })
  @ApiBadRequestResponse({ description: 'Incorrect OTP.' })
  @ApiBadGatewayResponse({
    description: 'Unable to register.',
  })
  @ApiBadRequestResponse({ description: 'Incorrect otp or user not found' })
  async verifyCustomer(
    @Body() customerOtp: CustomerOtpRequestDto,
  ): Promise<VerificationResponseDto> {
    return await this.authService.verifyCustomer(customerOtp);
  }

  @Post('logincustomer')
  @ApiBody({ type: CustomerLoginRequestDto })
  @ApiCreatedResponse({
    description: 'User login successfull.',
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBadGatewayResponse({
    description: 'Unable to login.',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect password.',
  })
  @ApiNotFoundResponse({ description: 'User not registered.' })
  async loginCustomer(
    @Body() loginCustomer: CustomerLoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.loginCustomer(loginCustomer);
  }
}
