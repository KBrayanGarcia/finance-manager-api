import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKey } from './entities/api-key.entity';
import { ApiKeyCreatedResponse } from './interfaces/api-key-created-response.interface';

/**
 * Controlador para la gestión de API Keys (Personal Access Tokens).
 */
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  async createApiKey(
    @CurrentUser() user: User,
    @Body() dto: CreateApiKeyDto,
  ): Promise<ApiKeyCreatedResponse> {
    return this.apiKeysService.createApiKey({ userId: user.id, dto });
  }

  @Get()
  async findAll(@CurrentUser() user: User): Promise<ApiKey[]> {
    return this.apiKeysService.findAllByUser(user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteApiKey(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.apiKeysService.deleteApiKey({ id, userId: user.id });
  }
}
