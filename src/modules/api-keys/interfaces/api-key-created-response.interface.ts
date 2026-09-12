import { ApiKey } from '../entities/api-key.entity';

/**
 * Respuesta generada al registrar una nueva API Key.
 * Expone la clave en texto plano `rawKey` por única vez.
 */
export interface ApiKeyCreatedResponse {
  readonly apiKey: ApiKey;
  readonly rawKey: string;
}
