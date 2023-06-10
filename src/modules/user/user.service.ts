import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../services/prisma/prisma.service';
import { IUserService } from '../../interfaces/IUserService';
import { User } from '@prisma/client';
import { CreateUserDTO } from './dtos/create-user.dto';
import SecurityUtil from '../../utils/security.util';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { IsNull } from '../../utils/common.util';
import { ResponseModel } from '../../ResponseModel';
import {
  EarnipayResponseMessage,
  EarnipayResponseStatus,
} from '../../enums/response.enum';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async createUser(dto: CreateUserDTO): Promise<ResponseModel<User>> {
    try {
      const encryptedPassword = await SecurityUtil.encryptPassword(
        dto.password,
      );

      dto.password = encryptedPassword;

      const user = await this.prismaService.user.create({
        data: { ...dto },
      });

      return new ResponseModel(
        EarnipayResponseStatus.SUCCESS,
        'Successfully created user.',
        user,
      );
    } catch (error) {
      console.error('createUser() error \n %o', error);

      return new ResponseModel(
        EarnipayResponseStatus.FAILED,
        error?.message || EarnipayResponseMessage.FAILED,
        null,
      );
    }
  }

  async findUserById(userId: number): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async findUserByEmail(email: string): Promise<ResponseModel<User>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (IsNull(user))
        throw new NotFoundException(
          'Could not find a user with that email address.',
        );

      return new ResponseModel(
        EarnipayResponseStatus.SUCCESS,
        EarnipayResponseMessage.SUCCESS,
        user,
      );
    } catch (error) {
      console.error('findUserByEmail() error \n %o', error);

      return new ResponseModel(
        EarnipayResponseStatus.FAILED,
        error?.message || EarnipayResponseMessage.FAILED,
        null,
      );
    }
  }

  async updateUser(
    userId: number,
    data: UpdateUserDTO,
  ): Promise<ResponseModel<User>> {
    try {
      let user = await this.prismaService.user.update({
        where: { id: userId },
        data,
      });

      return new ResponseModel(
        EarnipayResponseStatus.SUCCESS,
        'Successfully updated user',
        user,
      );
    } catch (error) {
      console.error('updateUser() error \n %o', error);

      return new ResponseModel(
        EarnipayResponseStatus.FAILED,
        error?.message || EarnipayResponseMessage.FAILED,
        null,
      );
    }
  }
}
