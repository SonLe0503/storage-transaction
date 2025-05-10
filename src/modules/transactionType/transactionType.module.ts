import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionType } from 'src/entities/TransactionType';

import { TransactionTypeController } from './transactionType.controller';
import { TransactionTypeService } from './transactionType.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionType])],
  providers: [TransactionTypeService],
  controllers: [TransactionTypeController],
})
export class TransactionTypeModule {}
