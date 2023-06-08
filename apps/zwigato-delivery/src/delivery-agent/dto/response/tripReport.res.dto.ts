import { ApiProperty } from '@nestjs/swagger';
import { CommonResDto } from 'src/dto/common_res.dto';
// import { Order } from 'src/db/entities/order.entity';

class DataRes {
  tripData: TripDetails[];

  totalTripEarning: number;

  constructor(Data: DataRes) {
    const { totalTripEarning, tripData } = Data;
    this.tripData = tripData.map((trip) => new TripDetails(trip));
    this.totalTripEarning = totalTripEarning;
  }
}

export class TripReportResDto extends CommonResDto {
  data: DataRes;

  constructor(status, msg, data) {
    super(status, msg);
    this.status = status;
    this.msg = msg;
    this.data = data;
  }
}

export class TripDetails {
  deliveredOn: string;
  orderId: string;
  restaurantName: string;
  customerName: string;
  deliveryCharges: string;
  distance: string;

  constructor(order: any) {
    const {
      date,
      orderId,
      restaurantName,
      customerName,
      tripEarning,
      distance,
    } = order;

    this.deliveredOn = date;
    this.orderId = orderId;
    this.restaurantName = restaurantName;
    this.customerName = customerName;
    this.deliveryCharges = tripEarning;
    this.distance = distance;
  }
}
