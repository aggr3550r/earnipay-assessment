import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import SecurityUtil from '../../utils/security.util';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const req = gqlContext.req;
    const res = gqlContext.res;

    let token: unknown;
    if (
      req?.headers?.authorization &&
      req?.headers?.authorization.startsWith('Bearer')
    ) {
      token = req?.headers?.authorization.split(' ')[1];
    } else if (req?.cookies?.jwt) {
      token = req?.cookies?.jwt;
    }

    // 2) Verify token in an async IIFE
    (async () => {
      try {
        const decoded = await SecurityUtil.verifyTokenWithSecret(
          token,
          process.env.JWT_SECRET,
        );
        const person = await this.userService.findUserById(decoded['id']);

        // GRANT ACCESS TO PROTECTED ROUTE
        req.currentUser = person;
        req.user = person;
      } catch (error) {
        console.error(error);
      }
    })();

    // guard should still let user through if they are authenticated despite the fact that the above code is mostly typical middleware code
    return !!req.user; // Return true if user is authenticated, false otherwise
  }
}
