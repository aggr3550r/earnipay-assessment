import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  Resolver,
  Query,
  ObjectType,
} from '@nestjs/graphql';
import { Task } from './task';
import { TaskService } from './task.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '@prisma/client';
import ModelledResponse from '../../creators/model-class-creator';
import PagingatedResponse from '../../creators/paging-class-creator';

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ defaultValue: false })
  completed: boolean;
}

@ObjectType()
export class ResponseModel<Task> extends ModelledResponse(Task) {}

@ObjectType()
export class PageDTO<Task> extends PagingatedResponse(Task) {}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  completed?: boolean;
}

@Resolver(() => Task)
@UseGuards(AuthGuard)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  async createTask(
    @CurrentUser() user: User,
    @Args('data') data: CreateTaskInput,
  ): Promise<ResponseModel<Task>> {
    const { id: userId } = user;
    return await this.taskService.createTask(userId, data);
  }

  @Query(() => ResponseModel<Task>)
  async taskById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ResponseModel<Task>> {
    return await this.taskService.getTaskById(id);
  }

  @Query(() => ResponseModel<PageDTO<Task>>)
  async tasksByUserId(
    @CurrentUser() user: User,
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ) {
    const pageOptionsDTO = { skip: (page - 1) * pageSize, take: pageSize };
    const { id: userId } = user;
    return await this.taskService.getTasksByUserId(userId, pageOptionsDTO);
  }

  @Query(() => ResponseModel<PageDTO<Task>>)
  async filterTasks(
    @CurrentUser() user: User,
    @Args('filter') filter: string,
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ) {
    const filterTaskDTO = {
      search_term: filter,
      skip: (page - 1) * pageSize,
      take: pageSize,
    };
    const { id: userId } = user;
    return await this.taskService.filterTasks(userId, filterTaskDTO);
  }

  @Mutation(() => ResponseModel<Task>)
  async updateTask(
    @Args('id') id: number,
    @Args('data') data: UpdateTaskInput,
  ): Promise<ResponseModel<Task>> {
    return await this.taskService.updateTask(id, data);
  }

  @Mutation(() => Task)
  async deleteTask(@Args('id') id: number): Promise<Task> {
    return await this.taskService.deleteTask(id);
  }
}
