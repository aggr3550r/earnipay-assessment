import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [],
  providers: [TaskResolver, TaskService, PrismaService, UserService],
})
export class TaskModule {}
