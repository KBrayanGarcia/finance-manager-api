import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { TransactionType } from '../../../common/enums/transaction-type.enum';

/**
 * DTO para el registro de transacciones (Gastos, Ingresos, Transferencias).
 */
export class CreateTransactionDto {
  @IsUUID('4', { message: 'El ID de la cuenta origen debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La cuenta origen es requerida' })
  readonly accountId: string;

  @IsEnum(TransactionType, {
    message: 'El tipo de transacción debe ser INCOME, EXPENSE o TRANSFER',
  })
  @IsNotEmpty({ message: 'El tipo de transacción es requerido' })
  readonly type: TransactionType;

  @IsNumber({}, { message: 'El monto debe ser un valor numérico' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  readonly amount: number;

  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  @IsOptional()
  readonly categoryId?: string;

  @IsUUID('4', {
    message: 'El ID de la cuenta destino debe ser un UUID válido',
  })
  @IsOptional()
  readonly destinationAccountId?: string;

  @IsDateString({}, { message: 'La fecha de la transacción no es válida' })
  @IsOptional()
  readonly transactionDate?: string;

  @IsString({ message: 'La descripción debe ser una cadena' })
  @IsOptional()
  readonly description?: string;
}
