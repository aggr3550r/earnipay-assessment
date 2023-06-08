import { Prisma, Task } from '@prisma/client';
import { UpdateTaskDTO } from '../modules/task/dtos/update-task.dto';
import { PageOptionsDTO } from '../paging/page-option.dto';
import { PageDTO } from '../paging/page.dto';
import { FilterTaskDTO } from '../modules/task/dtos/filter-tasks.dto';

export interface ITaskService {
  getTasksByUserId(
    userId: number,
    pageOptionsDTO: PageOptionsDTO,
  ): Promise<PageDTO<Task>>;

  createTask(userId: number, data: Prisma.TaskCreateInput): Promise<Task>;

  getTaskById(id: number, pageOptionsDTO: PageOptionsDTO): Promise<Task>;

  updateTask(id: number, data: UpdateTaskDTO): Promise<Task>;

  filterTasks(
    userId: number,
    filterTaskDTO: FilterTaskDTO,
  ): Promise<PageDTO<Task>>;

  deleteTask(id: number): Promise<Task | null>;
}
