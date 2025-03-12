import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { Transaction } from 'src/entities/Transaction';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './entities/User';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: process.env.DB_DRIVER as 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User, Transaction],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
