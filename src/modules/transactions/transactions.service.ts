import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { Account } from '../accounts/entities/account.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(params: {
    readonly userId: string;
    readonly dto: CreateTransactionDto;
  }): Promise<Transaction> {
    return this.dataSource.transaction(async (manager) => {
      const source = await this.validateAccount(manager, params.dto.accountId, params.userId);
      await this.applyBalanceChange(manager, source, params.dto, params.userId);

      const tx = manager.create(Transaction, {
        userId: params.userId,
        accountId: params.dto.accountId,
        type: params.dto.type,
        amount: params.dto.amount,
        categoryId: params.dto.categoryId,
        destinationAccountId: params.dto.destinationAccountId,
        transactionDate: params.dto.transactionDate
          ? new Date(params.dto.transactionDate)
          : new Date(),
        description: params.dto.description?.trim(),
      });

      return manager.save(tx);
    });
  }

  async findAllByUser(params: {
    readonly userId: string;
    readonly queryDto: QueryTransactionDto;
  }): Promise<{ readonly data: Transaction[]; readonly total: number }> {
    const qb = this.transactionRepository
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.account', 'account')
      .leftJoinAndSelect('tx.category', 'category')
      .leftJoinAndSelect('tx.destinationAccount', 'destinationAccount')
      .where('tx.userId = :userId', { userId: params.userId });

    this.applyQueryFilters(qb, params.queryDto);

    const [data, total] = await qb
      .orderBy('tx.transactionDate', 'DESC')
      .skip(params.queryDto.offset)
      .take(params.queryDto.limit)
      .getManyAndCount();

    return { data, total };
  }

  async findById(params: { readonly id: string; readonly userId: string }): Promise<Transaction> {
    const tx = await this.transactionRepository.findOne({
      where: { id: params.id, userId: params.userId },
      relations: ['account', 'category', 'destinationAccount'],
    });

    if (!tx) {
      throw new NotFoundException(`Transacción con ID ${params.id} no encontrada`);
    }

    return tx;
  }

  async updateTransaction(params: {
    readonly id: string;
    readonly userId: string;
    readonly dto: UpdateTransactionDto;
  }): Promise<Transaction> {
    return this.dataSource.transaction(async (manager) => {
      const existingTx = await manager.findOneBy(Transaction, {
        id: params.id,
        userId: params.userId,
      });

      if (!existingTx) {
        throw new NotFoundException(`Transacción con ID ${params.id} no encontrada`);
      }

      await this.revertBalanceChange(manager, existingTx);

      const effectiveDto = this.buildEffectiveUpdateDto(existingTx, params.dto);
      const source = await this.validateAccount(
        manager,
        effectiveDto.accountId,
        params.userId,
      );
      await this.applyBalanceChange(manager, source, effectiveDto, params.userId);

      const merged = manager.merge(Transaction, existingTx, {
        accountId: effectiveDto.accountId,
        type: effectiveDto.type,
        amount: effectiveDto.amount,
        categoryId: effectiveDto.categoryId ?? null,
        destinationAccountId: effectiveDto.destinationAccountId ?? null,
        transactionDate: effectiveDto.transactionDate
          ? new Date(effectiveDto.transactionDate)
          : existingTx.transactionDate,
        description: effectiveDto.description,
      });

      await manager.save(Transaction, merged);

      const reloaded = await manager.findOne(Transaction, {
        where: { id: existingTx.id, userId: params.userId },
        relations: ['account', 'category', 'destinationAccount'],
      });

      return reloaded ?? merged;
    });
  }

  async deleteTransaction(params: { readonly id: string; readonly userId: string }): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const tx = await this.findById(params);
      await this.revertBalanceChange(manager, tx);
      await manager.remove(tx);
    });
  }

  private buildEffectiveUpdateDto(
    existing: Transaction,
    dto: UpdateTransactionDto,
  ): Omit<CreateTransactionDto, 'description'> & { readonly description: string | null } {
    const type = dto.type ?? existing.type;
    const isTransfer = type === TransactionType.TRANSFER;
    const rawCategoryId = dto.categoryId !== undefined ? dto.categoryId : existing.categoryId;
    const rawDestinationId =
      dto.destinationAccountId !== undefined
        ? dto.destinationAccountId
        : existing.destinationAccountId;
    const rawDescription =
      dto.description !== undefined ? dto.description?.trim() || null : (existing.description ?? null);

    return {
      accountId: dto.accountId ?? existing.accountId,
      type,
      amount: dto.amount ?? Number(existing.amount),
      categoryId: isTransfer ? undefined : (rawCategoryId ?? undefined),
      destinationAccountId: isTransfer ? (rawDestinationId ?? undefined) : undefined,
      transactionDate: dto.transactionDate,
      description: rawDescription,
    };
  }

  private async validateAccount(
    manager: EntityManager,
    accountId: string,
    userId: string,
  ): Promise<Account> {
    const account = await manager.findOne(Account, {
      where: { id: accountId, userId, isActive: true },
    });
    if (!account) {
      throw new NotFoundException(`Cuenta de origen no encontrada o inactiva`);
    }
    return account;
  }

  private async applyBalanceChange(
    manager: EntityManager,
    source: Account,
    dto: Pick<CreateTransactionDto, 'type' | 'amount' | 'destinationAccountId'>,
    userId: string,
  ): Promise<void> {
    if (dto.type === TransactionType.INCOME) {
      source.currentBalance = Number(source.currentBalance) + Number(dto.amount);
      await manager.save(source);
      return;
    }

    if (dto.type === TransactionType.EXPENSE) {
      source.currentBalance = Number(source.currentBalance) - Number(dto.amount);
      await manager.save(source);
      return;
    }

    await this.handleTransfer(manager, source, dto, userId);
  }

  private async handleTransfer(
    manager: EntityManager,
    source: Account,
    dto: Pick<CreateTransactionDto, 'amount' | 'destinationAccountId'>,
    userId: string,
  ): Promise<void> {
    if (!dto.destinationAccountId) {
      throw new BadRequestException('Cuenta destino es requerida para transferencias');
    }
    if (dto.destinationAccountId === source.id) {
      throw new BadRequestException('No puedes transferir a la misma cuenta');
    }

    const destination = await this.validateAccount(manager, dto.destinationAccountId, userId);
    source.currentBalance = Number(source.currentBalance) - Number(dto.amount);
    destination.currentBalance = Number(destination.currentBalance) + Number(dto.amount);

    await manager.save([source, destination]);
  }

  private async revertBalanceChange(
    manager: EntityManager,
    tx: Transaction,
  ): Promise<void> {
    const source = await manager.findOneBy(Account, { id: tx.accountId });
    if (!source) return;

    if (tx.type === TransactionType.INCOME) {
      source.currentBalance = Number(source.currentBalance) - Number(tx.amount);
      await manager.save(source);
      return;
    }
    if (tx.type === TransactionType.EXPENSE) {
      source.currentBalance = Number(source.currentBalance) + Number(tx.amount);
      await manager.save(source);
      return;
    }
    if (tx.type === TransactionType.TRANSFER && tx.destinationAccountId) {
      const dest = await manager.findOneBy(Account, { id: tx.destinationAccountId });
      source.currentBalance = Number(source.currentBalance) + Number(tx.amount);
      if (dest) {
        dest.currentBalance = Number(dest.currentBalance) - Number(tx.amount);
        await manager.save([source, dest]);
        return;
      }
      await manager.save(source);
    }
  }

  private applyQueryFilters(
    qb: ReturnType<Repository<Transaction>['createQueryBuilder']>,
    queryDto: QueryTransactionDto,
  ): void {
    if (queryDto.accountId) {
      qb.andWhere('(tx.accountId = :accId OR tx.destinationAccountId = :accId)', {
        accId: queryDto.accountId,
      });
    }
    if (queryDto.categoryId) {
      qb.andWhere('tx.categoryId = :catId', { catId: queryDto.categoryId });
    }
    if (queryDto.type) {
      qb.andWhere('tx.type = :type', { type: queryDto.type });
    }
    if (queryDto.startDate) {
      qb.andWhere('tx.transactionDate >= :startDate', { startDate: queryDto.startDate });
    }
    if (queryDto.endDate) {
      qb.andWhere('tx.transactionDate <= :endDate', { endDate: queryDto.endDate });
    }
  }
}
