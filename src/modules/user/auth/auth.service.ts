import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user.service';
import { User } from '../user';
import SecurityUtil from '../../../utils/security.util';
import { Response } from 'express';
import {
  EarnipayResponseMessage,
  EarnipayResponseStatus,
} from '../../../enums/response.enum';
import { UserLoginDTO } from '../dtos/login.dto';
import { IsNull } from '../../../utils/common.util';
import { ResponseModel } from '../../../ResponseModel';

@Injectable()
export class AuthService {
  constructor(@Inject(UserService) private userService: UserService) {}

  /**
   * This method creates a JWT token to be sent to the client which it will use to make subsequent requests to protected routes. It also logs the user into the application in the same vein.
   * @param user
   * @param statusCode
   * @param res
   */
  async createAndSendAuthToken(user: User, statusCode: number, res: Response) {
    const token = await SecurityUtil.generateTokenWithSecretAndId(user.id);

    const cookieOptions = {
      expires: new Date(
        Date.now() +
          (Number(process.env.JWT_COOKIE_EXPIRES_IN) ?? 24) *
            24 *
            60 *
            60 *
            1000,
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production' || 'prod' || 'prd')
      cookieOptions['secure'] = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    console.log(token);

    res.status(statusCode).json({
      status: EarnipayResponseStatus.SUCCESS,
      token,
      data: {
        user,
      },
    });
  }

  async login(data: UserLoginDTO): Promise<ResponseModel<User>> {
    try {
      const user = await this.userService.findUserByEmail(data.email);

      if (IsNull(user))
        throw new NotFoundException('Could not find a user with that email');

      const plainPassword = data.password;
      const encryptedPassword = user.password;

      if (SecurityUtil.passwordIsCorrect(encryptedPassword, plainPassword)) {
        return new ResponseModel(
          EarnipayResponseStatus.SUCCESS,
          EarnipayResponseMessage.SUCCESS,
          user,
        );
      } else {
        return new ResponseModel(
          EarnipayResponseStatus.FAILED,
          EarnipayResponseMessage.FAILED,
          null,
        );
      }
    } catch (error) {
      console.error('login() error \n %o', error);
    }
  }
}
