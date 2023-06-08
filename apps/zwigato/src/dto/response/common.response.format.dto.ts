export class CommonResponseDto {
  isError: boolean;
  message: string;

  constructor(isError: boolean, message: string) {
    this.isError = isError;
    this.message = message;
  }
}
