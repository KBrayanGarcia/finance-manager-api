import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { User } from '../../users/entities/user.entity';

/**
 * Guard de autenticación dual: valida tokens JWT o API Keys (PAT).
 * Permite que los endpoints existentes funcionen tanto con la app web (JWT)
 * como con integraciones externas / MCP (header X-API-KEY o Bearer fm_live_...).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly apiKeysService: ApiKeysService) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: User }>();
    const apiKey = this.extractApiKey(request);

    if (apiKey) {
      const user = await this.apiKeysService.validateApiKey(apiKey);
      if (!user) {
        throw new UnauthorizedException('API Key inválida o expirada');
      }
      request.user = user;
      return true;
    }

    const result = super.canActivate(context);
    if (result instanceof Observable) {
      return firstValueFrom(result);
    }
    return result as Promise<boolean> | boolean;
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
