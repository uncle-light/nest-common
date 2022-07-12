import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 自定义异常
 */
export class CustomException extends HttpException {
  private readonly errorMessage: string;
  private readonly errorCode: number;
  private readonly data: any;
  /** */
  constructor(
    errorMessage: string,
    errorCode = 500,
    data?: any,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(errorMessage, statusCode);
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
    this.data = data;
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  getData() {
    return this.data;
  }
}
