/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Query,
  BadRequestException,
  Patch,
} from '@nestjs/common';

import { Transaction } from 'src/entities/Transaction';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import { JwtAuthGuard } from 'src/modules/guards/jwt-auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addTransaction(
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
  @Get('user/:bankName')
  async getTransactionByUserAndBank(
    @Request() request: any,
    @Param('bankName') bankName: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      if (!bankName) {
        throw new BadRequestException('Bank name is required');
      }
      const userId = request.user.id;
      return this.transactionService.getTransactionByUserAndBank(
        userId,
        bankName,
        startDate,
        endDate,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async markAsHandled(@Param('id') id: number) {
    try {
      return await this.transactionService.markAsHandled(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
