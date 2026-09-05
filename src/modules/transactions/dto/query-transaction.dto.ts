import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TransactionType } from '../../../common/enums/transaction-type.enum';

/**
 * DTO para filtros y paginación en el listado de transacciones.
 */
export class QueryTransactionDto {
  @IsUUID('4', { message: 'El ID de la cuenta debe ser un UUID válido' })
  @IsOptional()
  readonly accountId?: string;

  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  @IsOptional()
  readonly categoryId?: string;

  @IsEnum(TransactionType, { message: 'Tipo de transacción no válido' })
  @IsOptional()
  readonly type?: TransactionType;

  @IsDateString({}, { message: 'La fecha inicial no es válida' })
  @IsOptional()
  readonly startDate?: string;

  @IsDateString({}, { message: 'La fecha final no es válida' })
  @IsOptional()
  readonly endDate?: string;

  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit?: number = 20;

  @Type(() => Number)
  @IsInt({ message: 'El offset debe ser un número entero' })
  @Min(0)
  @IsOptional()
  readonly offset?: number = 0;
}
