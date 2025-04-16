/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as dayjs from 'dayjs';

import { join } from 'path';

import { unlink } from 'fs/promises';

import { TransactionType } from '../../entities/TransactionType';

@Injectable()
export class TransactionTypeService {
  constructor(
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async addTransactionType(
    transactionTypeData: Partial<TransactionType>,
    userId: number,
  ) {
    try {
      const newTransactionType = this.transactionTypeRepository.create({
        ...transactionTypeData,
        user: { id: userId },
      });
      return await this.transactionTypeRepository.save(newTransactionType);
    } catch (error) {
      throw error;
    }
  }
  async getTransactionLogCurrentMonth(userId: number) {
    try {
      const sql = `SELECT * FROM transaction_types WHERE userId = ? AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH) AND date <= CURRENT_DATE() ORDER BY date DESC`;
      return await this. transactionTypeRepository.query(sql, [userId]);
    } catch (error) {
      throw error;
    }
  }
  async getSpendCategoryCurrentMonth(userId: number) {
    try {
      const sql = `SELECT * from transaction_types WHERE userId = ? AND category = 'spend' AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH) AND date <= CURRENT_DATE() ORDER BY date DESC`;
      return await this.transactionTypeRepository.query(sql, [userId]);
    } catch (error) {
      throw error;
    }
  }
  async getIncomeCategoryCurrentMonth(userId: number) {
    try {
      const sql = `SELECT * from transaction_types WHERE userId = ? AND category = 'income' AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH) AND date <= CURRENT_DATE() ORDER BY date DESC`;
      return await this.transactionTypeRepository.query(sql, [userId]);
    } catch (error) {
      throw error;
    }
  }
  async getLendCategoryCurrentMonth(userId: number) {
    try {
      const sql = `SELECT * from transaction_types WHERE userId = ? AND category = 'lend' AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH) AND date <= CURRENT_DATE() ORDER BY date DESC`;
      return await this.transactionTypeRepository.query(sql, [userId]);
    } catch (error) {
      throw error;
    }
  }
  async getTransactionByMonth(userId: number, month: string) {
    try {
      const startDate = dayjs(`${month}-01`)
        .startOf('month')
        .format('YYYY-MM-DD');
      const endDate = dayjs(startDate).add(1, 'month').format('YYYY-MM-DD');
      const sql = `SELECT * FROM transaction_types WHERE userId = ? AND date >= ? AND date < ? ORDER BY date DESC`;
      return await this.transactionTypeRepository.query(sql, [
        userId,
        startDate,
        endDate,
      ]);
    } catch (error) {
      throw error;
    }
  }
  async updateTransactionTypeImage(id: number, imageUrl: string, userId: number) {
    try {
      const findSql = `SELECT imageFile FROM transaction_types WHERE id = ? AND userId = ?`;
      const [oldRecord] = await this.transactionTypeRepository.query(findSql, [id, userId]);
      if(!oldRecord) {
        throw new Error('Transaction type not found');
      }
      if(typeof oldRecord.imageFile === 'string' && oldRecord.imageFile.trim() !== '' && oldRecord.imageFile !== 'uploads/images/undefined') {
        try {
          const oldImagePath = join(process.cwd(), oldRecord.imageFile);
          await unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      const updateSql = `UPDATE transaction_types SET imageFile = ? WHERE id = ? AND userId = ?`;
      const result = await this.transactionTypeRepository.query(updateSql, [imageUrl, id, userId]);

      if(result.affectedRows === 0) {
        throw new Error('Failed to update image');
      }

      return {
        imageUrl: imageUrl,
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  async updateTransactionType(id: number, body: any, userId: number) {
    try {
      const findSql = `SELECT * FROM transaction_types WHERE id = ? AND userId = ?`;
      const [oldRecord] = await this.transactionTypeRepository.query(findSql, [id, userId]);
      if(!oldRecord) {
        throw new Error('Transaction type not found');
      }
      const updateSql = `UPDATE transaction_types SET description = ?, amount = ? WHERE id = ? AND userId = ?`;
      const result = await this.transactionTypeRepository.query(updateSql, [ body.description, body.amount, id, userId]);
      if(result.affectedRows === 0) {
        throw new Error('Failed to update transaction type');
      }
      return {
        message: 'Transaction type updated successfully',
      }   
    } catch (error) {
      throw error;
    }
  }
  async deleteTransactionType(id:number, userId: number) {
    try {
      const findSql = `SELECT * FROM transaction_types WHERE id = ? AND userId = ?`;
      const [oldRecord] = await this.transactionTypeRepository.query(findSql, [id, userId]);
      if(!oldRecord) {
        throw new Error('Transaction type not found');
      }
      const deleteSql = `DELETE FROM transaction_types WHERE id = ? AND userId = ?`;
      const result = await this.transactionTypeRepository.query(deleteSql, [id, userId]);
      if(result.affectedRows === 0) {
        throw new Error('Failed to delete transaction type');
      }
      return {
        message: 'Transaction type deleted successfully',
      }
    } catch (error) {
      throw error;
    }
  }
  // async getStartBalance(userId: number, month: string) {

  // }
}
