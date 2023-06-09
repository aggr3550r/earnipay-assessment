import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { join } from 'path';
import { PrismaService } from './services/prisma/prisma.service';
import { TaskResolver } from './modules/task/task.resolver';
import { TaskService } from './modules/task/task.service';
import { UserService } from './modules/user/user.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { UserResolver } from './modules/user/user.resolver';
import { AuthService } from './modules/user/auth/auth.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/rcp-exception.filter';

@Module({
  imports: [
    UserModule,
    TaskModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: { dateScalarMode: 'timestamp' },
    }),
  ],
  controllers: [],
  providers: [
    AuthService,
    AppService,
    PrismaService,
    TaskResolver,
    UserResolver,
    TaskService,
    UserService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .exclude(
        {
          path: 'graphql',
          method: RequestMethod.ALL,
        },
        {
          path: 'createUser',
          method: RequestMethod.ALL,
        },
      )
      .forRoutes('*');
  }
}
