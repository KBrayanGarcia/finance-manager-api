import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeysService } from './api-keys.service';
import { ApiKey } from './entities/api-key.entity';

/**
 * Módulo para la gestión y validación de API Keys.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
