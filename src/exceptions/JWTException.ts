import { HttpException, HttpStatus } from '@nestjs/common';

export class JWTException extends HttpException {
  constructor(message?: string, status?: HttpStatus) {
    message = message || 'An error occured while trying to process the JWT.';
    status = status || HttpStatus.BAD_REQUEST;
    super(message, status);
  }
}
