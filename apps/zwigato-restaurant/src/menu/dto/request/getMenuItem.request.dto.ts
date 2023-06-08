import { IsOptional, IsString } from 'class-validator';

export class GetMenuItemsRequestDTO {
  @IsOptional()
  @IsString()
  query: string;
}
