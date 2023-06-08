import { User } from '@prisma/client';
import { CreateUserDTO } from '../modules/user/dtos/create-user.dto';
import { UpdateUserDTO } from '../modules/user/dtos/update-user.dto';

export interface IUserService {
  createUser(data: CreateUserDTO): Promise<User>;
  updateUser(userId: number, data: UpdateUserDTO): Promise<User>;
  findUserById(userId: number): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
}
