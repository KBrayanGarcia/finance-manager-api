/**
 * Carga útil (payload) contenida en el token JWT.
 */
export interface JwtPayload {
  readonly sub: string;
  readonly email: string;
}
