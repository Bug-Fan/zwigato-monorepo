import { Address } from 'src/db/entities/address.entitiy';
import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class GetAddressResponseDto extends CommonResponseDto {
  data: GetAddressResponseData;

  constructor(isError: boolean, message: string, address: Address[]) {
    super(isError, message);
    this.data = new GetAddressResponseData(address);
  }
}

export class GetAddressResponseData {
  address: Address[];
  constructor(address: Address[]) {
    this.address = address;
  }
}
