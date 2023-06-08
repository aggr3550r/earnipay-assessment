import { Task } from '@prisma/client';

export interface IUserService {
  getTasksByUserId(userId: number): Promise<Task[]>;
}
