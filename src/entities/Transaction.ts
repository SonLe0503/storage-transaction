import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bankName: string;

  @Column()
  date: string;

  @Column()
  amount: string;

  @Column()
  description: string;

  @Column()
  userId: number;
}
