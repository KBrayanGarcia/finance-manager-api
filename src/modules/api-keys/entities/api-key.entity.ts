import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Entidad de API Key para autenticación de integraciones externas (ej. Servidor MCP).
 */
@Entity('api_keys')
export class ApiKey extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  readonly userId: string;

  @ManyToOne(() => User, (user) => user.apiKeys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  readonly user: User;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  keyHash: string;

  @Column({ type: 'varchar', length: 16 })
  prefix: string;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;
}
