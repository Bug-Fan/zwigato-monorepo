import { ApiProperty } from "@nestjs/swagger";
import { CommonResDto } from "src/dto/commonResponse.dto";

export class getDeliveryAgentRes extends CommonResDto {
  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  orderId: string;
  agent: agentDataRes
  constructor(isError,message,obj) {
    super(isError,message);
    this.orderId = obj.orderId
    this.agent = obj.deliveryAgent
  }
}

class agentDataRes {
  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  agentId: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  agentName: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  agentPhone: string;

  @ApiProperty({
    name: 'orderId',
    type: 'string',
  })
  vehicaleNumber: string;
}
