import {
  Resolver,
  Mutation,
  Args,
  Query,
  InputType,
  Field,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user';
import { AuthService } from './auth/auth.service';
import { ResponseModel } from '../../ResponseModel';
import { IsNotNull } from '../../utils/common.util';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name?: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  name?: string;

  @Field()
  email?: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => ResponseModel<User>)
  async createUser(
    @Args('data') data: CreateUserInput,
  ): Promise<ResponseModel<User>> {
    return await this.userService.createUser(data);
  }

  @Mutation(() => ResponseModel<User>)
  async login(
    @Args('data') data: LoginUserInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginResponse: ResponseModel<User> = await this.authService.login(
      data,
    );

    if (IsNotNull(loginResponse.data)) {
      this.authService.createAndSendAuthToken(loginResponse?.data, 200, res);
    } else {
      return new ResponseModel(400, loginResponse?.message, loginResponse);
    }
  }

  @Query(() => User)
  async findUserById(@Args('userId') userId: number): Promise<User> {
    return await this.userService.findUserById(userId);
  }

  @Query(() => ResponseModel<User>)
  async findUserByEmail(
    @Args('email') email: string,
  ): Promise<ResponseModel<User>> {
    return await this.userService.findUserByEmail(email);
  }

  @Mutation(() => ResponseModel<User>)
  async updateUser(
    @Args('userId') userId: number,
    @Args('data') data: UpdateUserInput,
  ): Promise<ResponseModel<User>> {
    return await this.userService.updateUser(userId, data);
  }
}
