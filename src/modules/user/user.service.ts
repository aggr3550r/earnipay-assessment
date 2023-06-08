import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../services/prisma/prisma.service';
import { IUserService } from '../../interfaces/IUserService';
import { Task } from '@prisma/client';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return this.prismaService.task.findMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
