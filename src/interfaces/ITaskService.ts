import { Prisma, Task } from '@prisma/client';
import { UpdateTaskDTO } from '../modules/task/dtos/update-task.dto';
import { PageOptionsDTO } from '../paging/page-option.dto';
import { PageDTO } from '../paging/page.dto';
import { FilterTaskDTO } from '../modules/task/dtos/filter-tasks.dto';
import { ResponseModel } from '../ResponseModel';

export interface ITaskService {
  getTasksByUserId(
    userId: number,
    pageOptionsDTO: PageOptionsDTO,
  ): Promise<ResponseModel<PageDTO<Task>>>;

  createTask(
    userId: number,
    data: Prisma.TaskCreateInput,
  ): Promise<ResponseModel<Task>>;

  getTaskById(
    id: number,
    pageOptionsDTO: PageOptionsDTO,
  ): Promise<ResponseModel<Task>>;

  updateTask(id: number, data: UpdateTaskDTO): Promise<ResponseModel<Task>>;

  filterTasks(
    userId: number,
    filterTaskDTO: FilterTaskDTO,
  ): Promise<ResponseModel<PageDTO<Task>>>;

  deleteTask(id: number): Promise<Task | null>;
}
