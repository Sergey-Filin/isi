export interface ServerError {
  [key: string]: string;
}

export class ErrorDto {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly error: ServerError,
  ) {
  }
}
