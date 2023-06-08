import { FoodCategory } from 'src/database/entities/foodCategory.entity';
import { CommonResDto } from 'src/dto/commonResponse.dto';
import { DeepPartial } from 'typeorm';

export class FoodCatesResponse extends CommonResDto {
  data: DeepPartial<FoodCategory>[];
  constructor(
    isError: boolean,
    message: string,
    data: DeepPartial<FoodCategory>[],
  ) {
    super(isError, message);
    this.data = data;
  }
}
