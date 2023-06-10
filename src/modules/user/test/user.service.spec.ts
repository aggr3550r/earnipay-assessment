import { UserService } from '../user.service';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { ResponseModel } from '../../../ResponseModel';
import { CreateUserDTO } from '../dtos/create-user.dto';
import {
  createUserDTOMock,
  updateUserDTOMock,
  userErrorResponse,
  userMock,
  userSuccessResponse,
} from './mocks/create-user.mock';
import {
  EarnipayResponseMessage,
  EarnipayResponseStatus,
} from '../../../enums/response.enum';
import { UpdateUserDTO } from '../dtos/update-user.dto';

// Mock UserService
jest.mock('../user.service');

describe('UserService', () => {
  let userService: UserService;
  let prismaServiceMock: PrismaService;

  beforeEach(() => {
    prismaServiceMock = {
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
    } as unknown as PrismaService;

    userService = new UserService(prismaServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return success response', async () => {
      const createUserDto: CreateUserDTO = createUserDTOMock;

      (userService.createUser as jest.Mock).mockResolvedValueOnce(
        userSuccessResponse,
      );

      const result = await (userService.createUser as jest.Mock)(createUserDto);

      expect(result.statusCode).toBe(EarnipayResponseStatus.SUCCESS);
      expect(result.message).toBe(EarnipayResponseMessage.SUCCESS);
      expect(result.data).toEqual(userMock);
    });

    it('should return failed response if there is an error during user creation', async () => {
      const createUserDto: CreateUserDTO = createUserDTOMock;

      (userService.createUser as jest.Mock).mockResolvedValueOnce(
        userErrorResponse,
      );

      const result = await (userService.createUser as jest.Mock)(createUserDto);

      expect(result.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(result.message).toBe(EarnipayResponseMessage.FAILED);
      expect(result.data).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID and return the user object', async () => {
      const userId = 1;

      // Mock the findUserById method of the UserService
      (userService.findUserById as jest.Mock).mockResolvedValueOnce(userMock);

      const result = await (userService.findUserById as jest.Mock)(userId);

      expect(result).toEqual(userMock);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email and return success response', async () => {
      const email = 'test@example.com';

      (userService.findUserByEmail as jest.Mock).mockResolvedValueOnce(
        new ResponseModel(
          EarnipayResponseStatus.SUCCESS,
          EarnipayResponseMessage.SUCCESS,
          userMock,
        ),
      );

      const result = await (userService.findUserByEmail as jest.Mock)(email);

      expect(result.statusCode).toBe(EarnipayResponseStatus.SUCCESS);
      expect(result.message).toBe(EarnipayResponseMessage.SUCCESS);
      expect(result.data).toEqual(userMock);
    });

    it('should return error response if user with the provided email is not found', async () => {
      const email = 'test@example.com';

      (userService.findUserByEmail as jest.Mock).mockResolvedValueOnce(
        userErrorResponse,
      );

      const result = await (userService.findUserByEmail as jest.Mock)(email);

      expect(result.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(result.message).toBe(EarnipayResponseMessage.FAILED);
      expect(result.data).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user and return success response', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDTO = updateUserDTOMock;

      (userService.updateUser as jest.Mock).mockResolvedValueOnce(
        new ResponseModel(
          EarnipayResponseStatus.SUCCESS,
          'Successfully updated user',
          userMock,
        ),
      );

      const result = await (userService.updateUser as jest.Mock)(
        userId,
        updateUserDto,
      );

      expect(result.statusCode).toBe(EarnipayResponseStatus.SUCCESS);
      expect(result.message).toBe('Successfully updated user');
      expect(result.data).toEqual(userMock);
    });

    it('should return failed response if there is an error during user update', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDTO = updateUserDTOMock;

      (userService.updateUser as jest.Mock).mockResolvedValueOnce(
        new ResponseModel(
          EarnipayResponseStatus.FAILED,
          EarnipayResponseMessage.FAILED,
          null,
        ),
      );

      const result = await (userService.updateUser as jest.Mock)(
        userId,
        updateUserDto,
      );

      expect(result.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(result.message).toBe(EarnipayResponseMessage.FAILED);
      expect(result.data).toBeNull();
    });
  });
});
