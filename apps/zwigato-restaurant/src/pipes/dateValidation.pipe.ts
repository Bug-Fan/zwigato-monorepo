import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { EarningRequestDTO } from 'src/restaurant/dto/request/earning.request.dto';

export class DateValidate implements PipeTransform {
  transform(value: EarningRequestDTO, metadata: ArgumentMetadata) {
    if (value.start && value.end) {
      let startDateTime = new Date(value.start);
      let endDateTime = new Date(value.end);

      if (startDateTime > new Date()) {
        throw new BadRequestException('Startdate must be old date');
      } else if (startDateTime > endDateTime) {
        throw new BadRequestException('StartDate should less than EndDate');
      }
      return value;
    }
  }
}
