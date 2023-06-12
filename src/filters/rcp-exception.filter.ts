import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpServer,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { EarnipayResponseStatus } from '../enums/response.enum';
import { Ctx } from 'type-graphql';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  constructor() {}

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const response = ctx.res;

    let data;

    // this.logger.error(`:: Exception raised :: \n %o`, exception);

    let status = exception?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      exception?.message ??
      exception?.response?.message ??
      exception?.message?.error;

    if (exception.status === HttpStatus.NOT_FOUND) {
      status = HttpStatus.NOT_FOUND;
      message = exception?.response?.message ?? exception?.message;
    }

    if (exception.status === EarnipayResponseStatus.FAILED) {
      status = HttpStatus.BAD_REQUEST;
      message = exception?.response?.message ?? exception?.message;
    }

    if (exception.status === HttpStatus.SERVICE_UNAVAILABLE) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = exception?.response?.message ?? exception?.message;
    }

    if (exception.status === HttpStatus.NOT_ACCEPTABLE) {
      status = HttpStatus.NOT_ACCEPTABLE;
      message = exception?.response?.message ?? exception?.message;
    }

    if (exception.status === HttpStatus.EXPECTATION_FAILED) {
      status = HttpStatus.EXPECTATION_FAILED;
      message = exception?.response?.message ?? exception?.message;
    }

    if (exception.status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.BAD_REQUEST;
      message = exception?.response?.message ?? exception?.message;
    }

    if ((exception?.statusCode ?? exception.status) === HttpStatus.CONFLICT) {
      status = HttpStatus.CONFLICT;
      message = exception?.message ?? 'Duplicate found!';
    }

    if (exception.status === HttpStatus.UNPROCESSABLE_ENTITY) {
      // this.logger.log('422 exception');
      // this.logger.log(exception?.response?.message ?? exception?.message);
      data = exception?.response?.message ?? exception?.message;
      message = 'Operation could not be processed!';
    }

    console.log('actual message', message);

    response?.status(status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: EarnipayResponseStatus.FAILED,
      message: message ?? 'Operation Failed',
      data: data ?? null,
    });
  }
}
