import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/guards/role.guard';
import { CustomerService } from './customer.service';
import { AddAddressReqDto } from './dto/req/address.request.dto';
import { UpdateProfileReqDto } from './dto/req/updateprofile.request.dto';
import { GetAddressResponseDto } from './dto/res/getAddress.response.dto';
import { ViewProfileResponseDto } from './dto/res/viewprofile.response.dto';
import { ProfileUpdateResponseDto } from './dto/res/profile.update.response.dto';
import { AddAddressResponseDto } from './dto/res/add.address.response.dto';
import { DeleteAddressResponseDto } from './dto/res/delete.address.response.dto';

@ApiTags('Customer')
@ApiBearerAuth()
@Controller('customer')
@UseGuards(AuthGuard('jwt'), new RoleGuard('user'))
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Patch('updateprofile')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileReqDto,
    @Req() req,
  ): Promise<ProfileUpdateResponseDto> {
    const customerId = req.user.customerId;
    return await this.customerService.updateProfile(
      customerId,
      updateProfileDto,
    );
  }

  @Post('addaddress')
  async addAddress(
    @Body() addAddressDto: AddAddressReqDto,
    @Req() req,
  ): Promise<AddAddressResponseDto> {
    const customerId = req.user.customerId;
    return await this.customerService.addAddress(customerId, addAddressDto);
  }

  @Get('getaddress')
  async getAddrres(@Req() req): Promise<GetAddressResponseDto> {
    const customerId = req.user.customerId;
    return await this.customerService.getAddress(customerId);
  }

  @Get('viewprofile')
  async viewProfile(@Req() req): Promise<ViewProfileResponseDto> {
    const customerId = req.user.customerId;
    return await this.customerService.viewProfile(customerId);
  }

  @Delete('deleteaddress/:addressId')
  async deleteAddressById(
    @Param('addressId') addressId: string,
    @Req() req,
  ): Promise<DeleteAddressResponseDto> {
    const customerId = req.user.customerId;
    return await this.customerService.deleteAddressById(addressId, customerId);
  }
}
