import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from 'src/modules/users/users.controller';
import { UserService } from 'src/modules/users/users.service';
import { User } from 'src/entities/User';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
