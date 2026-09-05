import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../../../common/enums/category-type.enum';

/**
 * DTO para la actualización de categorías.
 */
export class UpdateCategoryDto {
  @IsString({ message: 'El nombre de la categoría debe ser una cadena' })
  @IsOptional()
  readonly name?: string;

  @IsEnum(CategoryType, { message: 'El tipo de categoría debe ser EXPENSE o INCOME' })
  @IsOptional()
  readonly type?: CategoryType;

  @IsString({ message: 'El ícono debe ser una cadena' })
  @IsOptional()
  readonly icon?: string;

  @IsString({ message: 'El color debe ser una cadena' })
  @IsOptional()
  readonly color?: string;

  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  @IsOptional()
  readonly isActive?: boolean;
}
