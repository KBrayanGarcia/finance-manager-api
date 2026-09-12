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
import {
  ApiKeyResponseDto,
  CreateApiKeyResponseDto,
} from './dto/api-key-response.dto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

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
  ): Promise<CreateApiKeyResponseDto> {
    return this.apiKeysService.createApiKey({ userId: user.id, dto });
  }

  @Get()
  async findAll(@CurrentUser() user: User): Promise<ApiKeyResponseDto[]> {
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
