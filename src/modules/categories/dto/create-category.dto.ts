import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../../../common/enums/category-type.enum';

/**
 * DTO para la creación de categorías de gastos e ingresos.
 */
export class CreateCategoryDto {
  @IsString({ message: 'El nombre de la categoría debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
  readonly name: string;

  @IsEnum(CategoryType, { message: 'El tipo de categoría debe ser EXPENSE o INCOME' })
  @IsNotEmpty({ message: 'El tipo de categoría es requerido' })
  readonly type: CategoryType;

  @IsString({ message: 'El ícono debe ser una cadena' })
  @IsOptional()
  readonly icon?: string;

  @IsString({ message: 'El color debe ser una cadena' })
  @IsOptional()
  readonly color?: string;
}
