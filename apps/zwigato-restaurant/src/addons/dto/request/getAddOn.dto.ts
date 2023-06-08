import { IsString } from 'class-validator';

export class GetAddonDto {
  @IsString()
  query: string;
}
