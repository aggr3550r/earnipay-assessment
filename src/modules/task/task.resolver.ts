import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  Resolver,
  Query,
} from '@nestjs/graphql';
import { Task } from './task';
import { TaskService } from './task.service';

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ defaultValue: false })
  completed: boolean;
}

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
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  async createTask(
    @Args('userId') userId: number,
    @Args('data') data: CreateTaskInput,
  ): Promise<Task> {
    return this.taskService.createTask(userId, data);
  }

  @Query(() => Task)
  async taskById(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Query(() => [Task])
  async tasksByUserId(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ): Promise<Task[]> {
    const pageOptionsDTO = { skip: (page - 1) * pageSize, take: pageSize };
    const pageDTO = await this.taskService.getTasksByUserId(
      userId,
      pageOptionsDTO,
    );
    return pageDTO.data;
  }

  @Query(() => [Task])
  async filterTasks(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('filter') filter: string,
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ): Promise<Task[]> {
    const filterTaskDTO = {
      search_term: filter,
      skip: (page - 1) * pageSize,
      take: pageSize,
    };
    const pageDTO = await this.taskService.filterTasks(userId, filterTaskDTO);
    return pageDTO.data;
  }

  @Mutation(() => Task)
  async updateTask(
    @Args('id') id: number,
    @Args('data') data: UpdateTaskInput,
  ): Promise<Task> {
    return this.taskService.updateTask(id, data);
  }

  @Mutation(() => Task)
  async deleteTask(@Args('id') id: number): Promise<Task> {
    return this.taskService.deleteTask(id);
  }
}
