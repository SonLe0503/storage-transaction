import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Transaction } from 'src/entities/Transaction';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async addTransaction(transactionData: Partial<Transaction>[]) {
    console.log('bankData', transactionData);
    return this.transactionRepository.save(transactionData);
  }
  async getTransactionByUserAndBank(userId: number, bankName: string) {
    return await this.transactionRepository.find({
      where: { userId, bankName },
      order: { date: 'DESC' },
    });
  }
}
