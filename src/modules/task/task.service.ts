import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { Task } from '@prisma/client';
import { ITaskService } from '../../interfaces/ITaskService';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { IsEmpty, IsNull } from '../../utils/common.util';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { PageOptionsDTO } from '../../paging/page-option.dto';
import { PageMetaDTO } from '../../paging/page-meta.dto';
import { PageDTO } from '../../paging/page.dto';
import { FilterTaskDTO } from './dtos/filter-tasks.dto';

@Injectable()
export class TaskService implements ITaskService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}
  async createTask(userId: number, data: CreateTaskDTO): Promise<Task> {
    try {
      const task = await this.prismaService.task.create({
        data: {
          ...data,
          owner: { connect: { id: userId } },
        },
      });

      return task;
    } catch (error) {
      console.error('createTask() error %o', error);
    }
  }

  async getTasksByUserId(
    userId: number,
    pageOptionsDTO: PageOptionsDTO,
  ): Promise<PageDTO<Task>> {
    try {
      let tasks: Task[] = await this.prismaService.task.findMany({
        where: {
          ownerId: userId,
        },
        skip: pageOptionsDTO?.skip,
        take: pageOptionsDTO?.take,
      });

      if (IsEmpty(tasks))
        throw new NotFoundException('Could not find any tasks for that user');

      const pageMetaDTO = new PageMetaDTO({
        page_options_dto: pageOptionsDTO,
        total_items: tasks.length,
      });

      return new PageDTO(tasks, pageMetaDTO);
    } catch (error) {
      console.error('getTasksByUserId() \n %o', error);
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      let task = await this.prismaService.task.findUnique({
        where: { id },
      });

      if (!task)
        throw new NotFoundException('Could not find a task with that ID');

      return task;
    } catch (error) {
      console.error('getTaskById() error \n %o', error);
    }
  }

  async filterTasks(
    userId: number,
    filterTaskDTO: FilterTaskDTO,
  ): Promise<PageDTO<Task>> {
    try {
      const search_term = filterTaskDTO.search_term;

      if (IsEmpty(search_term) || IsNull(search_term))
        throw new NotAcceptableException(
          'You must enter a valid string for search_term',
        );

      const tasks = await this.prismaService.task.findMany({
        where: {
          ownerId: userId,
          OR: [
            { title: { contains: search_term, mode: 'insensitive' } },
            { description: { contains: search_term, mode: 'insensitive' } },
          ],
        },
        skip: filterTaskDTO?.skip,
        take: filterTaskDTO?.take,
      });

      const pageMetaDTO = new PageMetaDTO({
        page_options_dto: filterTaskDTO,
        total_items: tasks.length,
      });

      return new PageDTO(tasks, pageMetaDTO);
    } catch (error) {
      console.error('filterTasks() error \n %o', error);
    }
  }

  async updateTask(id: number, data: UpdateTaskDTO): Promise<Task> {
    try {
      let task = await this.prismaService.task.update({
        where: { id },
        data,
      });

      if (!task)
        throw new NotFoundException(
          'Could not find a task to update, please check that the id you entered is correct or actually belongs to a task you have created',
        );

      return task;
    } catch (error) {
      console.error('updateTask() error \n %o', error);
    }
  }

  async deleteTask(id: number): Promise<Task | null> {
    return this.prismaService.task.delete({
      where: { id },
    });
  }
}
