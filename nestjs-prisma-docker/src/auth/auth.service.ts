import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
const bcrypt = require('bcryptjs');
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  createUser = async (body: CreateAuthDto) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      body.password = bcrypt.hashSync(body.password, salt);

      const existUser = await this.prisma.user.findUnique({
        where: { email: body.email },
      });

      if (!existUser) {
        const newUser = await this.prisma.user.create({
          data: body,
        });
        return {
          success: true,
          message: 'New user registered successfully',
          data: newUser,
        };
      } else {
        return {
          success: false,
          message: 'user already exist.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  validateUser = async (email: string, password: string) => {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existUser) {
        const passwordCheck = bcrypt.compareSync(password, existUser.password);
        if (passwordCheck) {
          return existUser;
        } else {
          return {
            success: false,
            message: 'User not found',
          };
        }
      } else {
        return {
          success: false,
          message: 'User not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  login = async (user: any) => {
    try {
      if (Object.keys(user).length !== 0) {
        const data = {
          id: user.id,
          Name: user.name,
          email: user.email,
        };
        return {
          message: 'Login Successfully',
          success: true,
          data: {
            accessToken: this.jwtService.sign(data),
            data,
          },
        };
      } else {
        return {
          success: false,
          message: 'Login Unsuccessfull.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  verifyJwt = async (jwt: string) => {
    try {
      return this.jwtService.verify(jwt);
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };
}
