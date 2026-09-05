import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccountType } from '../../../common/enums/account-type.enum';

/**
 * DTO para la actualización de una cuenta financiera.
 */
export class UpdateAccountDto {
  @IsString({ message: 'El nombre de la cuenta debe ser una cadena' })
  @IsOptional()
  readonly name?: string;

  @IsEnum(AccountType, { message: 'Tipo de cuenta no válido' })
  @IsOptional()
  readonly type?: AccountType;

  @IsString({ message: 'El color debe ser una cadena' })
  @IsOptional()
  readonly color?: string;

  @IsString({ message: 'El ícono debe ser una cadena' })
  @IsOptional()
  readonly icon?: string;

  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  @IsOptional()
  readonly isActive?: boolean;
}
