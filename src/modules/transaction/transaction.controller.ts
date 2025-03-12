/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';

import { Transaction } from 'src/entities/Transaction';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import { JwtAuthGuard } from 'src/modules/guards/jwt-auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addBank(
    @Request() request: any,
    @Body() transactions: { transactions: Partial<Transaction>[] },
  ) {
    const transactionsWithUser = transactions.transactions.map(
      (transaction) => ({
        ...transaction,
        userId: request.user.id,
      }),
    );
    return this.transactionService.addTransaction(transactionsWithUser);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/bank/:bankName')
  async getTransactionByUserAndBank(
    @Request() request: any,
    @Param('bankName') bankName: string,
  ) {
    const userId = request.user.id
    return this.transactionService.getTransactionByUserAndBank(userId, bankName);
  }
}
