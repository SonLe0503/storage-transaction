import { Module } from '@nestjs/common';

import { AuthController } from 'src/modules/auth/auth.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
})
export class AuthModule {}
