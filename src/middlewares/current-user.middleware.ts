import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../modules/user/user.service';
import SecurityUtil from '../utils/security.util';
import { User } from '@prisma/client';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
      user?: User;
    }
  }
}

/**
 * The exceptions in this file have been turned off because as it turns out GraphQL does not afford us a clean way to specify middlewares for a particular resolver.
 *
 * This is a problem because despite the fact that the UserResolver needs to be able to work without flagging from this middleware the TaskResolver disagrees. It's pretty straightforward to isolate middleware behavior for two separate providers (and their corresponding endpoints) when we're using regular endpoints as in REST but not here.
 *
 * So this middleware will only serve the purpose of availing the authenticated user object to the requests that are in session.
 *
 * For the purpose of actually protecting the routes that need protection, we will use guards.
 */

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 1) Retrieve token

    let token: unknown;
    if (
      req?.headers?.authorization &&
      req?.headers?.authorization.startsWith('Bearer')
    ) {
      token = req?.headers?.authorization.split(' ')[1];
    } else if (req?.cookies?.jwt) {
      token = req?.cookies?.jwt;
    }

    // if (!token) {
    //   throw new UnauthorizedException('User not currently logged in!');
    // }

    // 2) Verify token
    const decoded = await SecurityUtil.verifyTokenWithSecret(
      token,
      process.env.JWT_SECRET,
    );

    // console.log(decoded);

    const person = await this.userService.findUserById(decoded['id']);

    // if (!person) throw new JWTException();

    console.info('currently logged in user', person);

    // GRANT ACCESS TO PROTECTED ROUTE
    req.currentUser = person;
    req.user = person;
    res.locals.user = person;
    res.locals.currentUser = person;

    next();
  }
}
