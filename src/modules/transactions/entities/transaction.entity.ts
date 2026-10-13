import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TransactionType } from '../../../common/enums/transaction-type.enum';
import { Account } from '../../accounts/entities/account.entity';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Entidad de Transacción (Ingreso, Gasto o Transferencia entre cuentas).
 */
@Entity('transactions')
export class Transaction extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  readonly userId: string;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  readonly user: User;

  @Index()
  @Column({ type: 'uuid' })
  readonly accountId: string;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  readonly account: Account;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  readonly categoryId?: string | null;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  readonly category?: Category | null;

  @Column({ type: 'uuid', nullable: true })
  readonly destinationAccountId?: string | null;

  @ManyToOne(() => Account, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'destinationAccountId' })
  readonly destinationAccount?: Account | null;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  readonly type: TransactionType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: {
      to: (val: number) => val,
      from: (val: string) => parseFloat(val),
    },
  })
  readonly amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly transactionDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  readonly description?: string | null;
}
