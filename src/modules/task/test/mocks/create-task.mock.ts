import { Task } from '@prisma/client';
import { CreateTaskDTO } from '../../dtos/create-task.dto';
import { ResponseModel } from '../../../../ResponseModel';
import {
  EarnipayResponseMessage,
  EarnipayResponseStatus,
} from '../../../../enums/response.enum';
import { UpdateTaskDTO } from '../../dtos/update-task.dto';
import { PageDTO } from '../../../../paging/page.dto';

export const createTaskDtoMock: CreateTaskDTO = {
  /* provide mock data for CreateTaskDTO */
  title: 'Grocery shopping',
  description: 'Buy groceries from supermarket',
};

export const updateTaskDtoMock: UpdateTaskDTO = {
  ...createTaskDtoMock,
  completed: true,
};

const timestamp = '2023-06-09T10:00:00Z';

export const taskMock: Task = {
  id: 1,
  title: 'Grocery shopping',
  description: 'Buy groceries from supermarket',
  createdAt: new Date(Date.parse(timestamp)),
  updatedAt: new Date(Date.parse(timestamp)),
  completed: false,
  ownerId: 2,
};

export const modelledTaskSuccessResponseMock: ResponseModel<Task> = {
  statusCode: EarnipayResponseStatus.SUCCESS,
  message: EarnipayResponseMessage.SUCCESS,
  data: taskMock,
};

export const pageTaskDTOMock: PageDTO<Task> = {
  data: [taskMock, taskMock],
  meta: {
    current_page: 1,
    items_per_page: 20,
    total_pages: 3,
    total_items: 20,
    has_next_page: true,
    has_previous_page: false,
  },
};

export const taskErrorResponse: ResponseModel<Task> = {
  statusCode: EarnipayResponseStatus.FAILED,
  message: EarnipayResponseMessage.FAILED,
  data: null,
};

export const modelledPageTaskErrorResponseMock: ResponseModel<PageDTO<Task>> = {
  statusCode: EarnipayResponseStatus.FAILED,
  message: EarnipayResponseMessage.FAILED,
  data: null,
};

export const modelledPageTaskSuccessResponseMock: ResponseModel<PageDTO<Task>> =
  {
    statusCode: EarnipayResponseStatus.SUCCESS,
    message: EarnipayResponseMessage.SUCCESS,
    data: pageTaskDTOMock,
  };
