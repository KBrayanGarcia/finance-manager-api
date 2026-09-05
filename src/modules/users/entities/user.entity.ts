import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Category } from '../../categories/entities/category.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

/**
 * Entidad de Usuario del sistema de administración financiera.
 */
@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 150, unique: true })
  readonly email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Account, (account) => account.user)
  readonly accounts: Account[];

  @OneToMany(() => Category, (category) => category.user)
  readonly categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  readonly transactions: Transaction[];
}
