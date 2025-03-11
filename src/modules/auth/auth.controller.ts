/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from 'src/modules/auth/auth.service';
import { LocalAuthGuard } from 'src/modules/guards/local-auth.guard';
import { UserService } from 'src/modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async register(@Body() userData: any) {
    return this.userService.createUser(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request: any) {
    return this.authService.login(request.user);
  }
}
