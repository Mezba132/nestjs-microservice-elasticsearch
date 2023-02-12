import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CheckTokenMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    let tokenArray: string[];

    if (req.headers['authorization']) {
      tokenArray = req.headers['authorization'].split(' ');
    } else {
      throw new BadRequestException('JWT token required');
    }

    const decodedToken = this.authService.verifyJwt(tokenArray[1]);

    if (decodedToken) {
      next();
    } else {
      return {
        success: false,
        message: 'Login Failed',
      };
    }
  }
}
