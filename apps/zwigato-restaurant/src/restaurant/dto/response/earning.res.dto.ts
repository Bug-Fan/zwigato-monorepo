import { CommonResDto } from 'src/dto/commonResponse.dto';

export class EarningResDTO extends CommonResDto {
  data: EarningRes;

  constructor(isError: boolean, message: string, data: EarningRes) {
    super(isError, message);
    this.data = data;
  }
}

export class EarningRes {
  start: Date;
  end: Date;
  totalorders: number;
  totalprofit: number;

  constructor(start, end, profit, orders) {
    this.start = start;
    this.end = end;
    this.totalorders = +orders;
    this.totalprofit = profit || 0;
  }
}
