import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para inicio de sesión.
 */
export class LoginDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  readonly email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  readonly password: string;
}
