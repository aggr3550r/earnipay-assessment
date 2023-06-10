import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserLoginDTO } from '../dtos/login.dto';
import { Response } from 'express';
import SecurityUtil from '../../../utils/security.util';
import { PrismaService } from '../../../services/prisma/prisma.service';
import {
  userErrorResponse,
  userMock,
  userSuccessResponse,
} from './mocks/create-user.mock';
import {
  EarnipayResponseMessage,
  EarnipayResponseStatus,
} from '../../../enums/response.enum';
import { AuthService } from '../auth/auth.service';
import { User } from '@prisma/client';

jest.mock('../user.service');
jest.mock('../../../utils/security.util');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let prismaServiceMock: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, UserService, PrismaService],
    }).compile();

    prismaServiceMock = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAndSendAuthToken', () => {
    it('should create a JWT token and send it as a cookie in the response', async () => {
      const user: User = userMock;

      const statusCode = 200;
      const res: Partial<Response<any, Record<string, any>>> = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const generateTokenMock = jest
        .spyOn(SecurityUtil, 'generateTokenWithSecretAndId')
        .mockResolvedValueOnce('jwt_token');

      await authService.createAndSendAuthToken(user, statusCode, res);

      expect(generateTokenMock).toHaveBeenCalledWith(user.id);
      expect(res.cookie).toHaveBeenCalledWith(
        'jwt',
        'jwt_token',
        expect.any(Object),
      );
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        status: EarnipayResponseStatus.SUCCESS,
        token: 'jwt_token',
        data: {
          user: expect.any(Object),
        },
      });

      generateTokenMock.mockRestore();
    });
  });

  describe('login', () => {
    it('should return success response if the email and password are a match', async () => {
      const loginDto: UserLoginDTO = {
        email: 'test@example.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce(userSuccessResponse);

      const result = await authService.login(loginDto);

      expect(result.statusCode).toBe(EarnipayResponseStatus.SUCCESS);
      expect(result.message).toBe(EarnipayResponseMessage.SUCCESS);
      expect(result).toEqual(userSuccessResponse);
    });

    it('should return failed response if the email is not found', async () => {
      const loginDto: UserLoginDTO = {
        email: 'test@example.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'login')
        .mockImplementation(async () => userErrorResponse);

      const result = await authService.login(loginDto);

      expect(result.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(result.message).toBe(EarnipayResponseMessage.FAILED);
      expect(result.data).toBeNull();
      expect(result).toEqual(userErrorResponse);
    });

    it('should handle error and return null if an exception is thrown', async () => {
      const loginDto: UserLoginDTO = {
        email: 'test@example.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'login')
        .mockImplementation(async () => userErrorResponse);

      const result = await authService.login(loginDto);

      expect(result.statusCode).toBe(EarnipayResponseStatus.FAILED);
      expect(result.message).toBe(EarnipayResponseMessage.FAILED);
      expect(result.data).toBeNull();
      expect(result).toEqual(userErrorResponse);
    });
  });
});
