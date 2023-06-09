import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  BadRequestException,
  Get,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express/multer';
import { storage } from 'src/database/storage.helper';
import { AuthService } from './auth.service';
import { RestaurantSignInDto } from './dto/request/restaurantSignIn.dto';
import { RestaurantSignUpDto } from './dto/request/restaurantSignUp.dto';
import { VerifyOtoDto } from './dto/request/verifyOtp.dto';
import { RestaurantSignInResDto } from './dto/response/restaurantSignIn.res.dto';
import { RestaurantSignUpResDto } from './dto/response/restaurantSignUp.res.dto';
import { unlink } from 'fs';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  @UseInterceptors(AnyFilesInterceptor(storage))
  async restaurantRegister(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png|jpeg)/ }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() restaurantSignUpDto: RestaurantSignUpDto,
  ): Promise<RestaurantSignUpResDto> {
    const logoImg = files.find((file) => file.fieldname == 'logoPath');
    const passBookImg = files.find(
      (file) => file.fieldname == 'passBookImagePath',
    );

    if (logoImg && passBookImg) {
      return await this.authService.restaurantSignUp(
        restaurantSignUpDto,
        logoImg.filename,
        passBookImg.filename,
      );
    }

    this.deleteFiles(files);
    throw new BadRequestException('All files are required to be uploaded');
  }

  @Post('verifyOtp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtoDto) {
    return this.authService.verifyOTP(verifyOtpDto);
  }

  @Post('signIn')
  restaurantLogin(
    @Body() restaurantSignInDto: RestaurantSignInDto,
  ): Promise<RestaurantSignInResDto> {
    return this.authService.restaurantSignIn(restaurantSignInDto);
  }

  deleteFiles(files: Array<Express.Multer.File>) {
    files.forEach((file) => {
      unlink(`${process.cwd()}/uploads/${file.filename}`, (er) => {
        if (er) console.log('Unable to delete file');
        else console.log(`file ${file.filename} deleted`);
      });
    });
  }

  @Get('getRestaurantTypes')
  getRestaurantTypes() {
    return this.authService.getRestaurantTypes();
  }
}
