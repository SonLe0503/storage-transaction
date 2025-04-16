import { TransactionType } from 'src/entities/TransactionType';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => TransactionType, (transactionType) => transactionType.user)
  transactionType: TransactionType[];
}
