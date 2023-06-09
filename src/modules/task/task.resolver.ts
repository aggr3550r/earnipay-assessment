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
import PaginatedResponse from '../../creators/paging-class-creator';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ defaultValue: false })
  completed: boolean;
}

@ObjectType()
export class TaskResponse<Task> extends ModelledResponse(Task) {}

@ObjectType()
export class TaskPage<Task> extends PaginatedResponse(Task) {}

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

  @Mutation(() => TaskResponse<Task>)
  async createTask(
    @CurrentUser() user: User,
    @Args('data') data: CreateTaskInput,
  ): Promise<TaskResponse<Task>> {
    const { id: userId } = user;
    return await this.taskService.createTask(userId, data);
  }

  @Query(() => TaskResponse<Task>)
  async taskById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TaskResponse<Task>> {
    return await this.taskService.getTaskById(id);
  }

  @Query(() => TaskResponse<TaskPage<Task>>)
  async tasksByUserId(
    @CurrentUser() user: User,
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ) {
    const pageOptionsDTO = { skip: (page - 1) * pageSize, take: pageSize };
    const { id: userId } = user;
    return await this.taskService.getTasksByUserId(userId, pageOptionsDTO);
  }

  @Query(() => TaskResponse<TaskPage<Task>>)
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

  @Mutation(() => TaskResponse<Task>)
  async updateTask(
    @Args('id') id: number,
    @Args('data') data: UpdateTaskInput,
  ): Promise<TaskResponse<Task>> {
    return await this.taskService.updateTask(id, data);
  }

  @Mutation(() => Task)
  async deleteTask(@Args('id') id: number): Promise<Task> {
    return await this.taskService.deleteTask(id);
  }
}
