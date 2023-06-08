import { ApiProperty } from '@nestjs/swagger';
import { CommonResDto } from 'src/dto/common_res.dto';

class DataRes {
  deliveryboyData: AgentDetails[];

  constructor(Data: DataRes) {
    const { deliveryboyData } = Data;
    this.deliveryboyData = deliveryboyData.map(
      (DeliveryAgent) => new AgentDetails(DeliveryAgent),
    );
  }
}
export class GetDeliveryBoyResponseDto extends CommonResDto {
  data: DataRes;
  constructor(isError, msg, data) {
    super(isError, msg);
    this.data = data;
  }
}

export class AgentDetails {
  agentId: string;
  agentName: string;
  agentEmail: string;
  agentAddressLine1: string;
  agentAddressLine2: string;
  pincode: string;
  city: string;
  state: string;
  agentLatitude: string;
  agentLongitude: string;
  agentPhone: string;
  adharcardNumber: string;
  licenceNumber: string;
  vehicaleNumber: string;
  bankName: string;
  bankIFSC: string;
  bankAccountNumber: string;
  registerdAt: Date;

  constructor(DeliveryAgent) {
    const {
      agentId,
      agentName,
      agentEmail,
      agentAddressLine1,
      agentAddressLine2,
      pincode,
      city,
      state,
      agentLatitude,
      agentLongitude,
      agentPhone,
      adharcardNumber,
      licenceNumber,
      vehicaleNumber,
      bankName,
      bankIFSC,
      bankAccountNumber,
      registerdAt,
    } = DeliveryAgent;
    this.agentId = agentId;
    this.agentName = agentName;
    this.agentEmail = agentEmail;
    this.pincode = pincode;
    this.city = city;
    this.state = state;
    this.agentAddressLine1 = agentAddressLine1;
    this.agentAddressLine2 = agentAddressLine2;
    this.agentLatitude = agentLatitude;
    this.agentLongitude = agentLongitude;
    this.agentPhone = agentPhone;
    this.bankName = bankName;
    this.bankIFSC = bankIFSC;
    this.bankAccountNumber = bankAccountNumber;
    this.adharcardNumber = adharcardNumber;
    this.licenceNumber = licenceNumber;
    this.vehicaleNumber = vehicaleNumber;
    this.registerdAt = registerdAt;
  }
}
