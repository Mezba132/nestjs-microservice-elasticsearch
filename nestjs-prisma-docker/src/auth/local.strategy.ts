import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  validate = async (email: string, password: string) => {
    try {
      const user = await this.authService.validateUser(email, password);
      if (user) {
        return user;
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };
}
