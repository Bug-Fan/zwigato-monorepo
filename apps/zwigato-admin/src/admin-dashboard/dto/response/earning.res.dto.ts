import { CommonResDto } from "src/dto/common_res.dto";

export class EarningResponseDto extends CommonResDto {
  data: EarningRes;
  constructor(isError, msg, earnData: EarningRes) {
    super(isError, msg);
    this.data = earnData;
  }
}

export class EarningRes {
  startDate: Date;
  endDate: Date;
  totalprofit: number;
  totalorders: number;

  constructor(startDate, endDate, totalorders, totalprofit) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalprofit = +(Number(totalprofit).toFixed(2));
    this.totalorders = totalorders;
  }
}
