import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/rcp-exception.filter';
import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpRef = app.getHttpAdapter().getHttpServer();

  const logger = new Logger();

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
      },

      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  await app.listen(3000, () => {
    console.log(`🚀 Server ready at: http://localhost:3000/graphql`);
  });
}
bootstrap();
