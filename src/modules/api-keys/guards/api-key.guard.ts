import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { ApiKeysService } from '../api-keys.service';

/**
 * Guard para proteger rutas que requieren autenticación mediante API Key.
 * Admite cabecera `X-API-KEY` o `Authorization: Bearer fm_live_...`.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: User }>();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API Key no proporcionada');
    }

    const user = await this.apiKeysService.validateApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException('API Key inválida o expirada');
    }

    request.user = user;
    return true;
  }

  private extractApiKey(request: Request): string | null {
    const headerKey = request.headers['x-api-key'];
    if (typeof headerKey === 'string' && headerKey.trim()) {
      return headerKey.trim();
    }

    const authHeader = request.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer fm_live_')) {
      return authHeader.slice(7).trim();
    }

    return null;
  }
}
