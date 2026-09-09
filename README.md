# 💰 Finance Manager API (Backend)

Backend modular desarrollado con **NestJS**, **TypeORM** y **MySQL** para el control y administración de finanzas personales.

> 🖥️ **Frontend Web**: [KBrayanGarcia/finance-manager-web](https://github.com/KBrayanGarcia/finance-manager-web)

---

## 🚀 Características Principales

- **🔐 Autenticación & Usuarios:** Registro, inicio de sesión seguro con contraseñas encriptadas mediante `bcrypt` y protección con JWT (`JwtAuthGuard` y `@CurrentUser()`).
- **🏦 Cuentas Financieras:** Soporte para múltiples tipos de cuenta (`CHECKING`, `SAVINGS`, `CREDIT_CARD`, `CASH`, `INVESTMENT`), control de moneda y seguimiento de saldo actual.
- **🏷️ Categorización:** Categorías personalizadas y globales para clasificar gastos (`EXPENSE`) e ingresos (`INCOME`).
- **💸 Transacciones Atómicas:**
  - Registro de **Ingresos** (aumenta el balance de la cuenta de forma atómica).
  - Registro de **Gastos** (descuenta el balance de la cuenta de forma atómica).
  - **Transferencias entre cuentas** (descuenta de la cuenta origen y acredita en la cuenta destino dentro de una transacción ACID de base de datos).
  - Reversión automática de balances al eliminar transacciones.
  - Filtros avanzados por rango de fechas, cuenta, categoría y tipo.

---

## 📂 Estructura del Proyecto

```text
src/
├── common/               # Enums, entidades base y tipos compartidos
│   ├── entities/         # BaseEntity (UUID, timestamps)
│   └── enums/            # AccountType, CategoryType, TransactionType
├── config/               # Configuraciones de TypeORM y JWT con variables de entorno
│   ├── database.config.ts
│   └── jwt.config.ts
├── modules/
│   ├── auth/             # Autenticación JWT, guards, decoradores y login/register
│   ├── users/            # Gestión de usuarios y perfiles
│   ├── accounts/         # Cuentas bancarias y balances
│   ├── categories/       # Categorías de ingresos y gastos
│   └── transactions/     # Ingresos, gastos y transferencias
├── app.module.ts
└── main.ts
```

---

## ⚙️ Requisitos y Configuración

1. **MySQL Server** en ejecución (versión 8.0+ recomendada).
2. Crear la base de datos:
   ```sql
   CREATE DATABASE finance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Configurar variables en el archivo `.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=root
   DB_DATABASE=finance_db
   DB_SYNCHRONIZE=true
   DB_LOGGING=true
   JWT_SECRET=super_secret_jwt_finance_key_change_in_production
   JWT_EXPIRES_IN=1d
   ```

---

## 💻 Comandos de Ejecución

```bash
# Instalar dependencias
npm install

# Compilar proyecto
npm run build

# Iniciar en modo desarrollo
npm run start:dev

# Iniciar en producción
npm run start:prod
```

---

## 📡 Catálogo de Endpoints de la API

Prefijo global: `/api/v1`

### 1. Autenticación (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Registro de usuario nuevo
- `POST /api/v1/auth/login` - Inicio de sesión (retorna `accessToken` y perfil)

### 2. Usuarios (`/api/v1/users`)
- `GET /api/v1/users/profile` - Consultar perfil del usuario autenticado *(Bearer Token requerido)*
- `PATCH /api/v1/users/profile` - Actualizar información del perfil o contraseña

### 3. Cuentas (`/api/v1/accounts`)
- `POST /api/v1/accounts` - Crear una nueva cuenta financiera
- `GET /api/v1/accounts` - Listar todas las cuentas del usuario
- `GET /api/v1/accounts/:id` - Obtener detalle de una cuenta específica
- `PATCH /api/v1/accounts/:id` - Actualizar datos de la cuenta
- `DELETE /api/v1/accounts/:id` - Desactivar/eliminar cuenta

### 4. Categorías (`/api/v1/categories`)
- `POST /api/v1/categories` - Crear categoría de ingreso o gasto
- `GET /api/v1/categories?type=EXPENSE` - Listar categorías (filtrando opcionalmente por `EXPENSE` o `INCOME`)
- `GET /api/v1/categories/:id` - Obtener detalle de una categoría
- `PATCH /api/v1/categories/:id` - Actualizar categoría
- `DELETE /api/v1/categories/:id` - Desactivar categoría

### 5. Transacciones (`/api/v1/transactions`)
- `POST /api/v1/transactions` - Registrar ingreso, gasto o transferencia (actualiza saldos automáticamente)
- `GET /api/v1/transactions` - Listar transacciones con filtros (`accountId`, `categoryId`, `type`, `startDate`, `endDate`, `limit`, `offset`)
- `GET /api/v1/transactions/:id` - Obtener detalle de una transacción
- `DELETE /api/v1/transactions/:id` - Eliminar transacción (revierte el saldo afectado)
