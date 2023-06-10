import { User } from '@prisma/client';
import { CreateUserDTO } from '../../dtos/create-user.dto';
import { UpdateUserDTO } from '../../dtos/update-user.dto';
import {
  EarnipayResponseMessage,
  EarnipayResponseStatus,
} from '../../../../enums/response.enum';
import { ResponseModel } from '../../../../ResponseModel';

export const createUserDTOMock: CreateUserDTO = {
  email: 'viktor.uche.07@gmail.com',
  password: 'medusa',
  name: 'Victor Uche',
};

export const updateUserDTOMock: UpdateUserDTO = createUserDTOMock;

const timestamp = '2023-06-09T10:00:00Z';

export const userMock: User = {
  id: 1,
  email: 'viktor.uche.07@gmail.com',
  password: 'hades',
  name: 'Victor Uche',
  createdAt: new Date(Date.parse(timestamp)),
  updatedAt: new Date(Date.parse(timestamp)),
};

export const userErrorResponse: ResponseModel<User> = {
  statusCode: EarnipayResponseStatus.FAILED,
  message: EarnipayResponseMessage.FAILED,
  data: null,
};

export const userSuccessResponse: ResponseModel<User> = {
  statusCode: EarnipayResponseStatus.SUCCESS,
  message: EarnipayResponseMessage.SUCCESS,
  data: userMock,
};
