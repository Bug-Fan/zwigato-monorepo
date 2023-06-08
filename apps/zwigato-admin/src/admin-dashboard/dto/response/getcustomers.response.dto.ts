import { ApiProperty } from '@nestjs/swagger';
import { CommonResDto } from 'src/dto/common_res.dto';

class DataRes {
  customerData: CustomerDetails[];

  constructor(Data: DataRes) {
    const { customerData } = Data;
    this.customerData = customerData.map(
      (customer) => new CustomerDetails(customer),
    );
  }
}

export class GetCustomersResponseDto extends CommonResDto {
  data: DataRes;
  constructor(isError, msg, data) {
    super(isError, msg);
    this.data = data;
  }
}

export class CustomerDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  constructor(customer) {
    const { customerName, customerEmail, customerPhone } = customer;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.customerPhone = customerPhone;
  }
}
