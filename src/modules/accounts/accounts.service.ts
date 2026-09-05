import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createAccount(params: {
    readonly userId: string;
    readonly dto: CreateAccountDto;
  }): Promise<Account> {
    const { userId, dto } = params;
    const initial = dto.initialBalance ?? 0;

    const account = this.accountRepository.create({
      userId,
      name: dto.name.trim(),
      type: dto.type,
      currency: dto.currency ?? 'MXN',
      initialBalance: initial,
      currentBalance: initial,
      color: dto.color,
      icon: dto.icon,
      isActive: true,
    });

    return this.accountRepository.save(account);
  }

  async findAllByUser(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(params: {
    readonly id: string;
    readonly userId: string;
  }): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: params.id, userId: params.userId },
    });

    if (!account) {
      throw new NotFoundException(`Cuenta con ID ${params.id} no encontrada`);
    }

    return account;
  }

  async updateAccount(params: {
    readonly id: string;
    readonly userId: string;
    readonly dto: UpdateAccountDto;
  }): Promise<Account> {
    const account = await this.findById({
      id: params.id,
      userId: params.userId,
    });

    const updated = this.accountRepository.merge(account, {
      name: params.dto.name?.trim() ?? account.name,
      type: params.dto.type ?? account.type,
      color: params.dto.color ?? account.color,
      icon: params.dto.icon ?? account.icon,
      isActive: params.dto.isActive ?? account.isActive,
    });

    return this.accountRepository.save(updated);
  }

  async deleteAccount(params: {
    readonly id: string;
    readonly userId: string;
  }): Promise<void> {
    const account = await this.findById(params);
    await this.accountRepository.save(
      this.accountRepository.merge(account, { isActive: false }),
    );
  }
}
