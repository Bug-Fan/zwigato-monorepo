import { Customer } from 'src/db/entities/customer.entity';
import { CommonResponseDto } from 'src/dto/response/common.response.format.dto';

export class ViewProfileResponseDto extends CommonResponseDto {
  data: ViewProfileResponseData;
  constructor(isError: boolean, message: string, userProfile: Customer) {
    super(isError, message);
    this.data = new ViewProfileResponseData(userProfile);
  }
}

export class ViewProfileResponseData {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerId: string;

  constructor(customer: Customer) {
    const { customerEmail, customerName, customerPhone, customerId } = customer;

    this.customerId = customerId;
    this.customerEmail = customerEmail;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
  }
}
