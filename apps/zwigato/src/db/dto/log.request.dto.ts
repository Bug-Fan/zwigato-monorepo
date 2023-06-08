export class LogRequestDto {
  host: string;
  path: string;
  method: string;
  body: string;
  query: string;
  userId: string | null;

  constructor(host, path, method, body, query, userId: string | undefined) {
    this.host = host;
    this.path = path;
    this.method = method;
    this.body = body;
    this.query = query;
    this.userId = userId;
  }
}
