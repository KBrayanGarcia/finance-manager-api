import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import {
  ApiKeyResponseDto,
  CreateApiKeyResponseDto,
} from './dto/api-key-response.dto';
import { ApiKey } from './entities/api-key.entity';
import { generateApiKeyToken, hashApiKey } from './utils/api-key-crypto.util';

/**
 * Servicio para la gestión y validación de API Keys de integraciones externas.
 */
@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async createApiKey(params: {
    readonly userId: string;
    readonly dto: CreateApiKeyDto;
  }): Promise<CreateApiKeyResponseDto> {
    const { rawKey, keyHash, prefix } = generateApiKeyToken();

    const apiKey = this.apiKeyRepository.create({
      userId: params.userId,
      name: params.dto.name.trim(),
      keyHash,
      prefix,
      expiresAt: params.dto.expiresAt ? new Date(params.dto.expiresAt) : undefined,
      isActive: true,
    });

    const savedApiKey = await this.apiKeyRepository.save(apiKey);
    return CreateApiKeyResponseDto.fromEntityAndRawKey(savedApiKey, rawKey);
  }

  async findAllByUser(userId: string): Promise<ApiKeyResponseDto[]> {
    const keys = await this.apiKeyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return keys.map(ApiKeyResponseDto.fromEntity);
  }

  async deleteApiKey(params: {
    readonly id: string;
    readonly userId: string;
  }): Promise<void> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id: params.id, userId: params.userId },
    });

    if (!apiKey) {
      throw new NotFoundException(`API Key con ID ${params.id} no encontrada`);
    }

    await this.apiKeyRepository.remove(apiKey);
  }

  async validateApiKey(rawKey: string): Promise<User | null> {
    const keyHash = hashApiKey(rawKey);
    const apiKey = await this.apiKeyRepository.findOne({
      where: { keyHash, isActive: true },
      relations: ['user'],
    });

    if (!apiKey?.user?.isActive) {
      return null;
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    apiKey.lastUsedAt = new Date();
    await this.apiKeyRepository.save(apiKey);
    return apiKey.user;
  }
}
