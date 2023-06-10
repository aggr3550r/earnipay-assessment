import { NotFoundException, NotAcceptableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { TaskService } from '../task.service';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import {
  EarnipayResponseMessage,
  EarnipayResponseStatus,
} from '../../../enums/response.enum';
import { PageOptionsDTO } from '../../../paging/page-option.dto';
import { Task } from '@prisma/client';
import { UpdateTaskDTO } from '../dtos/update-task.dto';
import {
  createTaskDtoMock,
  modelledPageTaskErrorResponseMock,
  modelledPageTaskSuccessResponseMock,
  modelledTaskSuccessResponseMock,
  taskErrorResponse,
  taskMock,
  updateTaskDtoMock,
} from './mocks/create-task.mock';
import { filterTaskDTOMock, pageOptionsDTOMock } from './mocks/get-task.mock';
import { FilterTaskDTO } from '../dtos/filter-tasks.dto';
import { ResponseModel } from '../../../ResponseModel';
import { PageDTO } from '../../../paging/page.dto';

jest.mock('../task.service.ts');

describe('TaskService', () => {
  let taskService: TaskService;
  let prismaServiceMock: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findFirst: jest.fn(),
              findFirstOrThrow: jest.fn(),
              findMany: jest.fn(),
              createMany: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    taskService = moduleRef.get<TaskService>(TaskService);
    prismaServiceMock = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task and return the response model', async () => {
      const userId = 1;
      const createTaskDto: ResponseModel<CreateTaskDTO> =
        modelledTaskSuccessResponseMock;

      jest
        .spyOn(taskService, 'createTask')
        .mockResolvedValueOnce(modelledTaskSuccessResponseMock);

      const response = await taskService.createTask(userId, createTaskDto.data);

      expect(response.statusCode).toBe(EarnipayResponseStatus.SUCCESS);
      expect(response.message).toBe(EarnipayResponseMessage.SUCCESS);
      expect(response.data).toEqual(taskMock);
    });

    it('should return a response model with an error message if an error occurs', async () => {
      const userId = 1;
      const createTaskDto: CreateTaskDTO = createTaskDtoMock;

      jest
        .spyOn(taskService, 'createTask')
        .mockImplementation(async () => taskErrorResponse);

      const response = await taskService.createTask(userId, createTaskDto);

      expect(response.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(response.message).toBe(EarnipayResponseMessage.FAILED);
      expect(response.data).toBeNull();
    });
  });

  describe('getTasksByUserId', () => {
    it('should return a response model with tasks for the provided user ID', async () => {
      const userId = 1;
      const pageOptionsDto: PageOptionsDTO = pageOptionsDTOMock;
      const taskResponse: ResponseModel<PageDTO<Task>> =
        modelledPageTaskSuccessResponseMock;

      jest
        .spyOn(taskService, 'getTasksByUserId')
        .mockImplementation(async () => taskResponse);

      const response = await taskService.getTasksByUserId(
        userId,
        pageOptionsDto,
      );

      expect(response.statusCode).toBe(EarnipayResponseStatus.SUCCESS);
      expect(response.message).toBe(EarnipayResponseMessage.SUCCESS);
      expect(response.data).toEqual(taskResponse.data);
      expect(response.data.meta).toBeDefined();
    });

    it('should returned a modelled error response if no tasks are found for the provided user ID', async () => {
      const userId = 1;
      const pageOptionsDto: PageOptionsDTO = pageOptionsDTOMock;

      jest
        .spyOn(taskService, 'getTasksByUserId')
        .mockImplementation(async () => modelledPageTaskErrorResponseMock);

      const response = await taskService.getTasksByUserId(
        userId,
        pageOptionsDto,
      );

      expect(response.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(response.message).toBe(EarnipayResponseMessage.FAILED);
      expect(response.data).toBeNull();
    });

    it('should return a response model with an error message if an error occurs', async () => {
      const userId = 1;
      const pageOptionsDto: PageOptionsDTO = pageOptionsDTOMock;

      jest
        .spyOn(taskService, 'getTasksByUserId')
        .mockImplementation(async () => modelledPageTaskErrorResponseMock);

      const response = await taskService.getTasksByUserId(
        userId,
        pageOptionsDto,
      );

      expect(response.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(response.message).toBe(EarnipayResponseMessage.FAILED);
      expect(response.data).toBeNull();
    });
  });

  describe('getTaskById', () => {
    it('should return a response model with the task for the provided task ID', async () => {
      const taskId = 1;
      const task: ResponseModel<Task> = modelledTaskSuccessResponseMock;

      jest.spyOn(taskService, 'getTaskById').mockResolvedValueOnce(task);

      const response = await taskService.getTaskById(taskId);

      expect(response.statusCode).toBe(EarnipayResponseStatus.SUCCESS);
      expect(response.message).toBe(EarnipayResponseMessage.SUCCESS);
      expect(response.data).toEqual(taskMock);
    });

    it('should return a modelled error response if no task is found for the provided task ID', async () => {
      const taskId = 1;

      jest
        .spyOn(taskService, 'getTaskById')
        .mockImplementation(async () => taskErrorResponse);

      const response = await taskService.getTaskById(taskId);

      expect(response.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(response.message).toBe(EarnipayResponseMessage.FAILED);
      expect(response.data).toBeNull();
    });

    it('should return a modelled response if an error occurs', async () => {
      const taskId = 1;

      jest
        .spyOn(taskService, 'getTaskById')
        .mockImplementation(async () => taskErrorResponse);

      const response = await taskService.getTaskById(taskId);

      expect(response.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(response.message).toBe(EarnipayResponseMessage.FAILED);
      expect(response.data).toBeNull();
    });
  });

  describe('filterTasks', () => {
    it('should return a response model with filtered tasks for the provided user ID and filter criteria', async () => {
      const userId = 1;
      const filterTaskDto: FilterTaskDTO = filterTaskDTOMock;
      const tasks: ResponseModel<PageDTO<Task>> =
        modelledPageTaskErrorResponseMock;

      jest.spyOn(taskService, 'filterTasks').mockResolvedValueOnce(tasks);

      const response = await taskService.filterTasks(userId, filterTaskDto);

      expect(response.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(response.message).toBe(EarnipayResponseMessage.FAILED);
      expect(response.data).toBeNull();
    });

    it('should return a response model with an error message if an error occurs', async () => {
      const userId = 1;
      const filterTaskDto: FilterTaskDTO = filterTaskDTOMock;

      jest
        .spyOn(taskService, 'filterTasks')
        .mockImplementation(async () => modelledPageTaskErrorResponseMock);

      const response = await taskService.filterTasks(userId, filterTaskDto);

      expect(response.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(response.message).toBe(EarnipayResponseMessage.FAILED);
      expect(response.data).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update a task and return the response model', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDTO = updateTaskDtoMock;
      const updatedTaskResponse: ResponseModel<Task> =
        modelledTaskSuccessResponseMock;

      jest
        .spyOn(taskService, 'updateTask')
        .mockResolvedValueOnce(updatedTaskResponse);

      const response = await taskService.updateTask(taskId, updateTaskDto);

      expect(response.statusCode).toBe(EarnipayResponseStatus.SUCCESS);
      expect(response.message).toBe(EarnipayResponseMessage.SUCCESS);
      expect(response).toEqual(updatedTaskResponse);
    });

    it('should return a modelled error response if no task is found for the provided task ID', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDTO = updateTaskDtoMock;

      jest
        .spyOn(taskService, 'updateTask')
        .mockImplementation(async () => taskErrorResponse);

      const result = await taskService.updateTask(taskId, updateTaskDto);

      expect(result.statusCode).toBe(taskErrorResponse.statusCode);
      expect(result.message).toBe(taskErrorResponse.message);
      expect(result.data).toBeNull();
    });

    it('should return a response model with an error message if an error occurs', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDTO = updateTaskDtoMock;

      jest
        .spyOn(taskService, 'updateTask')
        .mockImplementation(async () => taskErrorResponse);

      const response = await taskService.updateTask(taskId, updateTaskDto);

      expect(response.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(response.message).toBe(EarnipayResponseMessage.FAILED);
      expect(response.data).toBeNull();
    });
  });
});
