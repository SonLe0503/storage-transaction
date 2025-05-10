/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Transaction } from 'src/entities/Transaction';

import { format } from 'date-fns';

import * as dayjs from 'dayjs';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async addTransaction(transactionData: Partial<Transaction>[]) {
    try {
      for (const transaction of transactionData) {
        const { userId, bankName, amount, description } = transaction;
        const date = dayjs(transaction.date).format('YYYY-MM-DD');
        let checkSql = `SELECT COUNT(*) as count FROM transactions 
        WHERE userId = ? AND bankName = ? AND date = ? AND amount = ? AND description = ? AND isHandled = FALSE`;
        const result = await this.transactionRepository.query(checkSql, [
          userId,
          bankName,
          date,
          amount,
          description,
        ]);
        if (result[0].count === '0') {
          let insertSql = `
          INSERT INTO transactions (userId, bankName, date, amount, description, isHandled) 
          VALUES (?, ?, ?, ?, ?, FALSE)`;

          await this.transactionRepository.query(insertSql, [
            userId,
            bankName,
            date,
            amount,
            description,
          ]);
        }
      }
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTransactionByUserAndBank(
    userId: number,
    bankName: string,
    startDate?: string,
    endDate?: string,
  ) {
    try {
      const conditions = [` userId = ?`, ` bankName = ?`, ` isHandled = FALSE`];
      const params: any[] = [userId, bankName];

      if ( startDate ) {
        conditions.push(`date > ?`);
        params.push(format(new Date(startDate), 'yyyy-MM-dd'));
      }
      if ( endDate ) {
        conditions.push(`date < ?`);
        params.push(format(new Date(endDate), 'yyyy-MM-dd'));
      }
      const whereClause = conditions.join(' AND');
      const sql = `SELECT * FROM transactions WHERE ${whereClause} ORDER BY date DESC`;
      return await this.transactionRepository.query(sql, params);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async markAsHandled(id: number) {
    try {
      const sql = `UPDATE transactions SET isHandled = TRUE WHERE id = ?`;
      await this.transactionRepository.query(sql, [id]);
      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
