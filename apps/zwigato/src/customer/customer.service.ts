import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Address } from 'src/db/entities/address.entitiy';
import { Customer } from 'src/db/entities/customer.entity';
import { DataSource } from 'typeorm';
import { AddAddressReqDto } from './dto/req/address.request.dto';
import { UpdateProfileReqDto } from './dto/req/updateprofile.request.dto';
import { GetAddressResponseDto } from './dto/res/getAddress.response.dto';
import { ViewProfileResponseDto } from './dto/res/viewprofile.response.dto';
import { ProfileUpdateResponseDto } from './dto/res/profile.update.response.dto';
import { AddAddressResponseDto } from './dto/res/add.address.response.dto';
import { DeleteAddressResponseDto } from './dto/res/delete.address.response.dto';

@Injectable()
export class CustomerService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}

  async updateProfile(
    customerId: string,
    updateProfileDto: UpdateProfileReqDto,
  ): Promise<ProfileUpdateResponseDto> {
    const { customerName, customerPhone } = updateProfileDto;
    try {
      if (customerName === undefined && customerPhone === undefined) {
        throw new BadRequestException();
      } else {
        const updateProfile = await this.dataSource.manager.update(
          Customer,
          { customerId, isEmailVerified: true },
          updateProfileDto,
        );
        if (updateProfile.affected > 0) {
          return new ProfileUpdateResponseDto(false, 'Profile Updated');
        } else {
          throw new BadGatewayException();
        }
      }
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException('Please enter field to be updated');
      } else {
        console.log(error);
        throw new BadGatewayException('Not able to update profile, try again.');
      }
    }
  }

  async addAddress(
    customerId: string,
    addAddressDto: AddAddressReqDto,
  ): Promise<AddAddressResponseDto> {
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      addressLatitude,
      addressLongitude,
    } = addAddressDto;

    try {
      const addedTotalAddress = await this.dataSource.manager.find(Address, {
        where: {
          customerId,
        },
      });

      if (addedTotalAddress.length <= 4) {
        const insertAddress = await this.dataSource.manager.insert(Address, {
          customerId,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          addressLatitude,
          addressLongitude,
        });
        if (insertAddress.identifiers.length > 0) {
          return new AddAddressResponseDto(false, 'Address added');
        } else {
          throw new BadGatewayException();
        }
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException(
          'You are already added maximum address, please delete address for adding new address',
        );
      } else {
        console.log(error);
        throw new BadGatewayException('Address not added, please try again');
      }
    }
  }

  async getAddress(customerId: string): Promise<GetAddressResponseDto> {
    try {
      const getAllAddress = await this.dataSource.manager.find(Address, {
        where: {
          customerId,
        },
      });

      if (getAllAddress.length > 0) {
        return new GetAddressResponseDto(
          false,
          'All address fetched',
          getAllAddress,
        );
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('You do not have any addresses added.');
      }
      throw new BadGatewayException('Unable to get Address');
    }
  }

  async deleteAddressById(
    addressId: string,
    customerId: string,
  ): Promise<DeleteAddressResponseDto> {
    try {
      const deletePost = await this.dataSource.manager.delete(Address, {
        addressId,
        customerId,
      });

      if (deletePost.affected > 0) {
        return new DeleteAddressResponseDto(
          false,
          'Address deleted succesfully.',
        );
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('The Address you selected does not exist.');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to delete address.');
      }
    }
  }

  async viewProfile(customerId: string): Promise<ViewProfileResponseDto> {
    try {
      const viewUserProfile = await this.dataSource.manager.findOne(Customer, {
        where: {
          customerId,
        },
      });

      if (viewUserProfile.isEmailVerified === true) {
        return new ViewProfileResponseDto(
          false,
          'Profile data fetched',
          viewUserProfile,
        );
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Data not found for user.');
      } else {
        console.log(error);
        throw new BadGatewayException('Unable to view profile');
      }
    }
  }
}
