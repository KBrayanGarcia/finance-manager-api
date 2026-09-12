import { createHash, randomBytes } from 'crypto';

const API_KEY_PREFIX = 'fm_live';
const DEFAULT_BYTE_ENTROPY = 24;
const PREFIX_DISPLAY_LENGTH = 12;

/**
 * Datos generados al crear un nuevo token de API Key.
 */
export interface GeneratedTokenData {
  readonly rawKey: string;
  readonly keyHash: string;
  readonly prefix: string;
}

/**
 * Genera un token seguro para API Key con su hash SHA-256 y prefijo de identificación.
 */
export function generateApiKeyToken(): GeneratedTokenData {
  const entropy = randomBytes(DEFAULT_BYTE_ENTROPY).toString('hex');
  const rawKey = `${API_KEY_PREFIX}_${entropy}`;
  const keyHash = hashApiKey(rawKey);
  const prefix = rawKey.slice(0, PREFIX_DISPLAY_LENGTH);

  return { rawKey, keyHash, prefix };
}

/**
 * Calcula el hash SHA-256 determinista para una clave en texto plano.
 */
export function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex');
}
