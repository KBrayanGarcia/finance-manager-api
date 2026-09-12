import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO para la solicitud de creación de una nueva API Key.
 */
export class CreateApiKeyDto {
  @IsString({ message: 'El nombre de la API Key debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de la API Key es requerido' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  readonly name: string;

  @IsDateString({}, { message: 'La fecha de expiración debe tener un formato ISO válido' })
  @IsOptional()
  readonly expiresAt?: string;
}
