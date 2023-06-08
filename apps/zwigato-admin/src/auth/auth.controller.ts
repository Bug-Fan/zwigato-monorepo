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
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { RegisterResponseDto } from './dto/response/register.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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

  @ApiTags('manager')
  @ApiBody({ type: RegisterRequestDto })
  @ApiCreatedResponse({
    type: RegisterRequestDto,
    description: 'Register successfully ',
  })
  @Post('registerManager')
  async registerManager(
    @Body() managerRegister: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.registerManager(managerRegister);
  }

  @ApiTags('manager')
  @ApiBody({ type: LoginRequestDto })
  @ApiCreatedResponse({
    type: LoginRequestDto,
    description: 'login successfully ',
  })
  @Post('loginManager')
  async loginManager(
    @Body() managerLogin: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.loginManager(managerLogin);
  }
}
