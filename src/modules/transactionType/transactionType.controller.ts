/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/modules/guards/jwt-auth.guard';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { TransactionTypeService } from './transactionType.service';

@Controller('transaction_type')
export class TransactionTypeController {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('add')
  @UseInterceptors(
    FileInterceptor('imageFile', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async addTransactionType(
    @Request() request: any,
    @UploadedFile() imageFile: Express.Multer.File | undefined,
    @Body() body: any,
  ) {
    const imageUrl = imageFile ? `uploads/images/${imageFile.filename}` : null;
    const userId = request.user.id;
    return await this.transactionTypeService.addTransactionType(
      {
        ...body,
        imageFile: imageUrl,
      },
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('current_month')
  async getTransactionLogCurrentMonth(@Request() request: any) {
    const userId = request.user.id;
    return await this.transactionTypeService.getTransactionLogCurrentMonth(
      userId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('category/:type/current_month')
  async getSpendCategoryCurrentMonth(
    @Request() request: any,
    @Param('type') type: string,
  ) {
    const userId = request.user.id;
    switch (type) {
      case 'spend':
        return await this.transactionTypeService.getSpendCategoryCurrentMonth(
          userId,
        );
      case 'income':
        return await this.transactionTypeService.getIncomeCategoryCurrentMonth(
          userId,
        );
      case 'lend':
        return await this.transactionTypeService.getLendCategoryCurrentMonth(
          userId,
        );
      default:
        throw new BadRequestException('Invalid category type');
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('selected_month/:month')
  async getTransactionByMonth(
    @Request() request: any,
    @Param('month') month: string,
  ) {
    const userId = request.user.id;
    return await this.transactionTypeService.getTransactionByMonth(
      userId,
      month,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('upload_image')
  @UseInterceptors(
    FileInterceptor('imageFile', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateTransactionTypeImage(
    @Request() request: any,
    @UploadedFile() imageFile: Express.Multer.File | undefined,
    @Body() body: { id: number },
  ) {
    const imageUrl = imageFile ? `uploads/images/${imageFile.filename}` : null;
    const userId = request.user.id;
    return await this.transactionTypeService.updateTransactionTypeImage(
      body.id,
      imageUrl || '',
      userId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateTransactionType(
    @Request() request: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    const userId = request.user.id;
    return await this.transactionTypeService.updateTransactionType(
      id,
      body,
      userId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteTransactionType(
    @Request() request: any,
    @Param('id') id: number,
  ) {
    const userId = request.user.id;
    return await this.transactionTypeService.deleteTransactionType(id, userId);
  }
  // @UseGuards(JwtAuthGuard)
  // @Get('balance/start/:month')
  // async getStartBalance(
  //   @Param('month') month: string,
  //   @Request() request: any,
  // ) {
  //   const userId = request.user.id;
  //   return await this.transactionTypeService.getStartBalance(userId, month);
  // }
}
