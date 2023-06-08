import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { PrismaService } from '../../services/prisma/prisma.service';

@Module({
  imports: [],
  providers: [TaskResolver, TaskService, PrismaService],
})
export class TaskModule {}
