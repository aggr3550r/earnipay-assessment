import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { CurrentUserMiddleware } from '../../middlewares/current-user.middleware';

@Module({
  imports: [],
  providers: [TaskResolver, TaskService, PrismaService],
})
export class TaskModule {}
