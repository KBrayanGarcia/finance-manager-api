import { CategoryType } from "../../../common/enums/category-type.enum";

export interface DefaultCategoryDefinition {
  readonly name: string;
  readonly type: CategoryType;
  readonly icon: string;
  readonly color: string;
}

export const DEFAULT_CATEGORIES: readonly DefaultCategoryDefinition[] = [
  // Gastos (EXPENSE)
  {
    name: "Alimentación & Supermercado",
    type: CategoryType.EXPENSE,
    icon: "shopping-cart",
    color: "#EF4444",
  },
  {
    name: "Transporte",
    type: CategoryType.EXPENSE,
    icon: "car",
    color: "#F97316",
  },
  {
    name: "Vivienda & Servicios",
    type: CategoryType.EXPENSE,
    icon: "home",
    color: "#3B82F6",
  },
  {
    name: "Entretenimiento & Ocio",
    type: CategoryType.EXPENSE,
    icon: "film",
    color: "#8B5CF6",
  },
  {
    name: "Salud & Bienestar",
    type: CategoryType.EXPENSE,
    icon: "heart-pulse",
    color: "#EC4899",
  },
  {
    name: "Educación",
    type: CategoryType.EXPENSE,
    icon: "book-open",
    color: "#06B6D4",
  },
  {
    name: "Compras & Ropa",
    type: CategoryType.EXPENSE,
    icon: "shopping-bag",
    color: "#F59E0B",
  },
  {
    name: "Otros Gastos",
    type: CategoryType.EXPENSE,
    icon: "more-horizontal",
    color: "#6B7280",
  },
  // Ingresos (INCOME)
  {
    name: "Salario / Sueldo",
    type: CategoryType.INCOME,
    icon: "briefcase",
    color: "#10B981",
  },
  {
    name: "Inversiones & Rendimientos",
    type: CategoryType.INCOME,
    icon: "trending-up",
    color: "#059669",
  },
  {
    name: "Freelance & Proyectos",
    type: CategoryType.INCOME,
    icon: "laptop",
    color: "#14B8A6",
  },
  {
    name: "Regalos & Reembolsos",
    type: CategoryType.INCOME,
    icon: "gift",
    color: "#84CC16",
  },
  {
    name: "Otros Ingresos",
    type: CategoryType.INCOME,
    icon: "dollar-sign",
    color: "#64748B",
  },
];
