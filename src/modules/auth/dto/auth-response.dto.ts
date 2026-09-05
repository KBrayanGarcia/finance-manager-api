import { User } from '../../users/entities/user.entity';

/**
 * DTO para la respuesta de autenticación (Token y datos de usuario).
 */
export class AuthResponseDto {
  readonly accessToken: string;
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName?: string;
  };

  constructor(accessToken: string, user: User) {
    this.accessToken = accessToken;
    this.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
