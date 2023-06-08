import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { OtpRequestDto } from './dto/request/otp.request.dto';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { OtpResponseDto } from './dto/response/otp.response.dto';
import { RegisterResponseDto } from './dto/response/register.response.dto';
import { storage } from './storage.helper';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiTags('admin')
  @ApiBody({ type: LoginRequestDto })
  @ApiCreatedResponse({
    type: LoginResponseDto,
    description: 'login successfully ',
  })
  @Post('loginAdmin')
  async adminLogin(
    @Body() loginAdminDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.adminLogin(loginAdminDto);
  }

  @ApiTags('DeliveryAgent')
  @ApiBody({ type: RegisterRequestDto })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: 'registered agent',
  })
  @ApiConflictResponse({
    description: 'already register agent',
  })
  @ApiBadRequestResponse({
    description: 'cannot register agent',
  })
  @Post('registerAgent')
  @UseInterceptors(AnyFilesInterceptor(storage))
  async deliveryAgentRegister(
    @Body() registerDeliveryAgent: RegisterRequestDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<LoginResponseDto> {
    return await this.authService.deliveryAgentRegister(
      registerDeliveryAgent,
      files[0].filename,
      files[1].filename,
      files[2].filename,
      files[3].filename,
      files[4].filename,
    );
  }

  @ApiTags('DeliveryAgent')
  @ApiBody({ type: OtpRequestDto })
  @ApiCreatedResponse({
    type: OtpResponseDto,
    description: 'Verified Status',
  })
  @ApiBadRequestResponse({
    description: 'unable to verify',
  })
  @Patch('verifyAgent')
  async verifyAgent(
    @Body() verifyDeliveryagent: OtpRequestDto,
  ): Promise<OtpResponseDto> {
    return await this.authService.verifyAgent(verifyDeliveryagent);
  }

  @ApiTags('DeliveryAgent')
  @ApiBody({ type: LoginRequestDto })
  @ApiCreatedResponse({
    type: LoginResponseDto,
    description: 'login successfully',
  })
  @ApiBadRequestResponse({
    description: 'cannot login',
  })
  @Post('loginAgent')
  async loginAgent(
    @Body() loginAgentDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.deliveryAgentLogin(loginAgentDto);
  }
}
