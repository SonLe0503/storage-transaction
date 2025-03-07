import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from '../../entities/User';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại! ');
    }
    const user = this.userRepository.create(userData);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }
  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }
}
