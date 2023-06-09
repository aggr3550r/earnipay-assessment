import { User } from '@prisma/client';
import { CreateUserDTO } from '../modules/user/dtos/create-user.dto';
import { UpdateUserDTO } from '../modules/user/dtos/update-user.dto';
import { ResponseModel } from '../ResponseModel';

export interface IUserService {
  createUser(data: CreateUserDTO): Promise<ResponseModel<User>>;
  updateUser(userId: number, data: UpdateUserDTO): Promise<ResponseModel<User>>;
  findUserById(userId: number): Promise<User>;
  findUserByEmail(email: string): Promise<ResponseModel<User>>;
}
