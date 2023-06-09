import {
  Resolver,
  Mutation,
  Args,
  Query,
  InputType,
  Field,
  ObjectType,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user';
import { AuthService } from './auth/auth.service';
import { IsNotNull } from '../../utils/common.util';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import ModelledResponse from '../../creators/model-class-creator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  name?: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  name?: string;

  @Field(() => String)
  email?: string;
}

@InputType()
export class LoginUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class UserResponse<Task> extends ModelledResponse(User) {}

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => UserResponse<User>)
  async createUser(
    @Args('data') data: CreateUserInput,
  ): Promise<UserResponse<User>> {
    return await this.userService.createUser(data);
  }

  @Mutation(() => UserResponse<User>)
  async login(
    @Args('data') data: LoginUserInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginResponse: UserResponse<User> = await this.authService.login(
      data,
    );

    if (IsNotNull(loginResponse.data)) {
      this.authService.createAndSendAuthToken(loginResponse?.data, 200, res);
    } else {
      return new UserResponse(400, loginResponse?.message, loginResponse?.data);
    }
  }

  @Query(() => User)
  async findUserById(@Args('userId') userId: number): Promise<User> {
    return await this.userService.findUserById(userId);
  }

  @Query(() => UserResponse<User>)
  async findUserByEmail(
    @Args('email') email: string,
  ): Promise<UserResponse<User>> {
    return await this.userService.findUserByEmail(email);
  }

  @Mutation(() => UserResponse<User>)
  async updateUser(
    @Args('userId') userId: number,
    @Args('data') data: UpdateUserInput,
  ): Promise<UserResponse<User>> {
    return await this.userService.updateUser(userId, data);
  }
}
