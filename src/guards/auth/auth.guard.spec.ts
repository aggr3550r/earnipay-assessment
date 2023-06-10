import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { UserService } from '../../modules/user/user.service';
import { userMock } from '../../modules/user/test/mocks/create-user.mock';
import SecurityUtil from '../../utils/security.util';

jest.mock('../../utils/security.util');

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = moduleRef.get<AuthGuard>(AuthGuard);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should return true if user is authenticated', async () => {
    const mockUser = userMock;
    const mockRequest = {
      headers: { authorization: 'Bearer token' },
    };
    const mockResponse = {};

    const mockExecutionContext = {
      getContext: jest.fn().mockReturnValue({
        req: mockRequest,
        res: mockResponse,
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockExecutionContext as any);

    jest.spyOn(userService, 'findUserById').mockResolvedValue(mockUser);

    (SecurityUtil.verifyTokenWithSecret as jest.Mock).mockResolvedValue({
      id: mockUser.id,
    });

    jest.spyOn(guard, 'canActivate').mockImplementation(() => true);

    const canActivate = await guard.canActivate({} as ExecutionContext);

    expect(canActivate).toBe(true);
  });

  it('should return false if user is not authenticated', async () => {
    const mockRequest = {
      headers: {},
    };
    const mockResponse = {};

    const mockExecutionContext = {
      getContext: jest.fn().mockReturnValue({
        req: mockRequest,
        res: mockResponse,
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockExecutionContext as any);

    const canActivate = await guard.canActivate({} as ExecutionContext);

    expect(canActivate).toBe(false);
  });

  it('should set currentUser and user properties on the request object when user is authenticated', async () => {
    const mockUser = userMock;
    const mockRequest = {
      headers: { authorization: 'Bearer token' },
      currentUser: mockUser,
      user: mockUser,
    };
    const mockResponse = {};

    const mockExecutionContext = {
      getContext: jest.fn().mockReturnValue({
        req: mockRequest,
        res: mockResponse,
      }),
    };

    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockExecutionContext as any);

    jest.spyOn(userService, 'findUserById').mockResolvedValue(mockUser);

    jest.spyOn(guard, 'canActivate').mockImplementation(() => true);

    const canActivate = await guard.canActivate({} as ExecutionContext);

    expect(canActivate).toBe(true);
    expect(mockRequest.currentUser).toBe(mockUser);
    expect(mockRequest.user).toBe(mockUser);
  });
});
