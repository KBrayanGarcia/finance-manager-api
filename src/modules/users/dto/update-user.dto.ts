import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO para la actualización de perfil de usuario.
 */
export class UpdateUserDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  readonly firstName?: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsOptional()
  readonly lastName?: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  @IsOptional()
  readonly password?: string;
}
