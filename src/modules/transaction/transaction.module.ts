import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from 'src/entities/Transaction';
import { User } from 'src/entities/User';
import { TransactionController } from 'src/modules/transaction/transaction.controller';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User]), UsersModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
