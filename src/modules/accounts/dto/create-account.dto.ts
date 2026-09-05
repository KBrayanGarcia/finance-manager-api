import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AccountType } from '../../../common/enums/account-type.enum';

/**
 * DTO para la creación de una cuenta financiera.
 */
export class CreateAccountDto {
  @IsString({ message: 'El nombre de la cuenta debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de la cuenta es requerido' })
  readonly name: string;

  @IsEnum(AccountType, { message: 'Tipo de cuenta no válido' })
  @IsNotEmpty({ message: 'El tipo de cuenta es requerido' })
  readonly type: AccountType;

  @IsString({ message: 'La moneda debe ser una cadena' })
  @IsOptional()
  readonly currency?: string;

  @IsNumber({}, { message: 'El balance inicial debe ser un valor numérico' })
  @Min(0, { message: 'El balance inicial no puede ser negativo' })
  @IsOptional()
  readonly initialBalance?: number;

  @IsString({ message: 'El color debe ser una cadena' })
  @IsOptional()
  readonly color?: string;

  @IsString({ message: 'El ícono debe ser una cadena' })
  @IsOptional()
  readonly icon?: string;
}
