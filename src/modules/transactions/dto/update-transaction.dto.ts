import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { TransactionType } from '../../../common/enums/transaction-type.enum';

/**
 * DTO para la actualización parcial de una transacción financiera.
 */
export class UpdateTransactionDto {
  @IsUUID('4', { message: 'El ID de la cuenta origen debe ser un UUID válido' })
  @IsOptional()
  readonly accountId?: string;

  @IsEnum(TransactionType, {
    message: 'El tipo de transacción debe ser INCOME, EXPENSE o TRANSFER',
  })
  @IsOptional()
  readonly type?: TransactionType;

  @IsNumber({}, { message: 'El monto debe ser un valor numérico' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  @IsOptional()
  readonly amount?: number;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  @IsOptional()
  readonly categoryId?: string | null;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUUID('4', {
    message: 'El ID de la cuenta destino debe ser un UUID válido',
  })
  @IsOptional()
  readonly destinationAccountId?: string | null;

  @IsDateString({}, { message: 'La fecha de la transacción no es válida' })
  @IsOptional()
  readonly transactionDate?: string;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString({ message: 'La descripción debe ser una cadena' })
  @IsOptional()
  readonly description?: string | null;
}
