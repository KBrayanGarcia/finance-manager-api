import { ApiKey } from '../entities/api-key.entity';

/**
 * DTO para la respuesta de API Keys en listados para la interfaz de usuario.
 * Excluye campos sensibles o internos como `keyHash`, `userId` y `updatedAt`.
 */
export class ApiKeyResponseDto {
  readonly id: string;
  readonly name: string;
  readonly prefix: string;
  readonly isActive: boolean;
  readonly lastUsedAt?: Date;
  readonly expiresAt?: Date;
  readonly createdAt: Date;

  static fromEntity(entity: ApiKey): ApiKeyResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      prefix: entity.prefix,
      isActive: entity.isActive,
      lastUsedAt: entity.lastUsedAt,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
    };
  }
}

/**
 * DTO para la respuesta de creación de API Key.
 * Expone la clave en texto plano `rawKey` de forma aplanada y por única vez.
 */
export class CreateApiKeyResponseDto {
  readonly id: string;
  readonly name: string;
  readonly prefix: string;
  readonly rawKey: string;
  readonly isActive: boolean;
  readonly expiresAt?: Date;
  readonly createdAt: Date;

  static fromEntityAndRawKey(
    entity: ApiKey,
    rawKey: string,
  ): CreateApiKeyResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      prefix: entity.prefix,
      rawKey,
      isActive: entity.isActive,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
    };
  }
}
