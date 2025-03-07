import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { UserService } from 'src/modules/users/users.service';

import * as bcrypt from 'bcrypt';
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async register(@Body() userData: any) {
    return this.userService.createUser(userData);
  }

  @Post('/login')
  async login(@Body() loginData: { username: string; password: string }) {
    const user = await this.userService.getUserByUsername(loginData.username);
    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return { message: 'Login successful', user };
  }
}
