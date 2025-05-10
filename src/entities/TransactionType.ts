import { User } from 'src/entities/User';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transaction_types')
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column()
  date: string;

  @Column({ nullable: true })
  imageFile: string;

  @ManyToOne(() => User, (user) => user.transactionType)
  user: User;
}
