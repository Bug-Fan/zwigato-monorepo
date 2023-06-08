import { IsBoolean } from 'class-validator';

export class UpdateRestaurantAvailibilityDTO {
  @IsBoolean()
  isAvailable: boolean;
}
