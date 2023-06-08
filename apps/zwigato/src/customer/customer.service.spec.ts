import { faker } from '@faker-js/faker';
import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { CustomerService } from './customer.service';
import { AddAddressReqDto } from './dto/req/address.request.dto';
import { UpdateProfileReqDto } from './dto/req/updateprofile.request.dto';
import { AddAddressResponseDto } from './dto/res/add.address.response.dto';
import { DeleteAddressResponseDto } from './dto/res/delete.address.response.dto';
import { GetAddressResponseDto } from './dto/res/getAddress.response.dto';
import { ProfileUpdateResponseDto } from './dto/res/profile.update.response.dto';
import { ViewProfileResponseDto } from './dto/res/viewprofile.response.dto';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let dataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CustomerService,
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
              delete: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    dataSource = module.get<DataSource>('DataSource');
  });

  describe('getAddress', () => {
    it('should be get addresss', async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          addressId: 22,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: faker.address.secondaryAddress(),
          pincode: faker.address.zipCode('######'),
          city: faker.address.cityName(),
          state: faker.address.state(),
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
        {
          addressId: 24,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: faker.address.secondaryAddress(),
          pincode: faker.address.zipCode('######'),
          city: faker.address.cityName(),
          state: faker.address.state(),
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
      ]);
      expect(
        await customerService.getAddress(
          'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
        ),
      ).toBeInstanceOf(GetAddressResponseDto);
    });

    it('should be not get address', () => {
      dataSource.manager.find.mockResolvedValue([]);
      expect(
        customerService.getAddress('ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05'),
      ).rejects.toThrow(
        new NotFoundException('You do not have any addresses added.'),
      );
    });

    it('should return bad gateway', () => {
      expect(
        customerService.getAddress('ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05'),
      ).rejects.toThrow(new BadGatewayException('Unable to get Address'));
    });
  });

  describe('viewProfile', () => {
    it('should view profile', async () => {
      const viewProfile = dataSource.manager.findOne.mockResolvedValue({
        customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
        customerEmail: faker.internet.email(),
        customerName: faker.name.fullName(),
        customerPhone: faker.phone.number('+91 ##### #####'),
        isEmailVerified: true,
      });

      expect(
        await customerService.viewProfile(
          'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
        ),
      ).toBeInstanceOf(ViewProfileResponseDto);
    });

    it('not found profile', () => {
      dataSource.manager.findOne.mockResolvedValue({});
      expect(
        customerService.viewProfile('ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05'),
      ).rejects.toThrow(new NotFoundException('Data not found for user.'));
    });

    it('bad gateway', () => {
      expect(
        customerService.viewProfile('ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05'),
      ).rejects.toThrow(new BadGatewayException('Unable to view profile'));
    });
  });

  describe('addAddress', () => {
    it('add address', async () => {
      const address: AddAddressReqDto = {
        addressLatitude: faker.address.latitude(),
        addressLongitude: faker.address.longitude(),
        addressLine1: faker.address.streetAddress(),
        city: faker.address.cityName(),
        pincode: faker.address.zipCode('######'),
        state: faker.address.state(),
        addressLine2: faker.address.secondaryAddress(),
      };
      dataSource.manager.find.mockResolvedValue([
        {
          addressId: 22,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: faker.address.secondaryAddress(),
          pincode: faker.address.zipCode('######'),
          city: faker.address.cityName(),
          state: faker.address.state(),
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
        {
          addressId: 24,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: faker.address.secondaryAddress(),
          pincode: faker.address.zipCode('######'),
          city: faker.address.cityName(),
          state: faker.address.state(),
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
      ]);
      dataSource.manager.insert.mockResolvedValue({
        identifiers: ['ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05'],
      });

      const expectedResponse = new AddAddressResponseDto(
        false,
        'Address added',
      );

      expect(
        await customerService.addAddress(
          'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          address,
        ),
      ).toStrictEqual(expectedResponse);
    });

    it('return bad gateway', () => {
      const address: AddAddressReqDto = {
        addressLatitude: faker.address.latitude(),
        addressLongitude: faker.address.longitude(),
        addressLine1: faker.address.streetAddress(),
        city: faker.address.cityName(),
        pincode: faker.address.zipCode('######'),
        state: faker.address.state(),
        addressLine2: faker.address.secondaryAddress(),
      };

      expect(
        customerService.addAddress(
          'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          address,
        ),
      ).rejects.toThrow(
        new BadGatewayException('Address not added, please try again'),
      );
    });

    it('should return bad request', () => {
      const address: AddAddressReqDto = {
        addressLatitude: faker.address.latitude(),
        addressLongitude: faker.address.longitude(),
        addressLine1: faker.address.streetAddress(),
        city: faker.address.cityName(),
        pincode: faker.address.zipCode('######'),
        state: faker.address.state(),
        addressLine2: faker.address.secondaryAddress(),
      };
      dataSource.manager.find.mockResolvedValue([
        {
          addressId: 22,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: null,
          pincode: '380059',
          city: 'Bayad',
          state: 'Gujarat',
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
        {
          addressId: 24,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: null,
          pincode: '380059',
          city: 'Bayad',
          state: 'Gujarat',
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
        {
          addressId: 24,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: null,
          pincode: '380059',
          city: 'Bayad',
          state: 'Gujarat',
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
        {
          addressId: 24,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: null,
          pincode: '380059',
          city: 'Bayad',
          state: 'Gujarat',
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
        {
          addressId: 24,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: null,
          pincode: faker.address.zipCode('######'),
          city: faker.address.cityName(),
          state: faker.address.state(),
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
        {
          addressId: 24,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: null,
          pincode: faker.address.zipCode('######'),
          city: faker.address.cityName(),
          state: faker.address.state(),
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
        {
          addressId: 24,
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          addressLine1: faker.address.streetAddress(),
          addressLine2: null,
          pincode: faker.address.zipCode('######'),
          city: faker.address.cityName(),
          state: faker.address.state(),
          addressLatitude: faker.address.latitude(),
          addressLongitude: faker.address.longitude(),
        },
      ]);

      expect(
        customerService.addAddress(
          'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          address,
        ),
      ).rejects.toThrow(
        new BadRequestException(
          'You are already added maximum address, please delete address for adding new address',
        ),
      );
    });
  });

  describe('updateProfile', () => {
    const customerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';
    it('should throw BadRequestException if no fields to update are provided', async () => {
      const updateProfile: UpdateProfileReqDto = {
        customerName: undefined,
        customerPhone: undefined,
      };
      await expect(
        customerService.updateProfile(customerId, updateProfile),
      ).rejects.toThrow(
        new BadRequestException('Please enter field to be updated'),
      );
    });

    it('should throw BadGatewayException if the update affects no rows', async () => {
      dataSource.manager.update.mockResolvedValueOnce({ affected: 0 });

      const updateProfile: UpdateProfileReqDto = {
        customerName: 'New Name',
        customerPhone: undefined,
      };
      await expect(
        customerService.updateProfile(customerId, updateProfile),
      ).rejects.toThrow(
        new BadGatewayException('Not able to update profile, try again.'),
      );
    });

    it('should return a ProfileUpdateResponseDto if the update succeeds', async () => {
      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      const updateProfileDto: UpdateProfileReqDto = {
        customerName: 'New Name',
        customerPhone: '9632587410',
      };
      const expectedResponse = new ProfileUpdateResponseDto(
        false,
        'Profile Updated',
      );

      const result = await customerService.updateProfile(
        customerId,
        updateProfileDto,
      );

      expect(result).toStrictEqual(expectedResponse);
    });
  });

  describe('deleteAddressById', () => {
    const addressId = '21';
    const customerId = 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05';
    it('should throw NotFoundException if the address is not found', async () => {
      dataSource.manager.delete.mockResolvedValueOnce({ affected: 0 });

      await expect(
        customerService.deleteAddressById(addressId, customerId),
      ).rejects.toThrow(
        new NotFoundException('The Address you selected does not exist.'),
      );
    });

    it('should throw BadGatewayException if there is an error deleting the address', async () => {
      dataSource.manager.delete.mockRejectedValueOnce(new Error());

      await expect(
        customerService.deleteAddressById(addressId, customerId),
      ).rejects.toThrow(new BadGatewayException('Unable to delete address.'));
    });

    it('should return a DeleteAddressResponseDto if the address is deleted successfully', async () => {
      dataSource.manager.delete.mockResolvedValue({ affected: 1 });
      const expectedResponse = new DeleteAddressResponseDto(
        false,
        'Address deleted succesfully.',
      );

      const result = await customerService.deleteAddressById(
        addressId,
        customerId,
      );

      expect(result).toStrictEqual(expectedResponse);
    });
  });
});
