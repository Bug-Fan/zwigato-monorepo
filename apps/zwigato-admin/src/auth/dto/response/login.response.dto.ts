export class LoginResponseDto {
  status: boolean;
  message: string;
  token?: string | undefined;

  constructor(status, message, token?: string | undefined) {
    this.status = status;
    this.message = message;
    this.token = token;
  }
}
