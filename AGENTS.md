# AGENTS.md

## 1. Resumen del Proyecto
Backend API REST para la administración de finanzas personales (**Finance Manager API**), construido con NestJS, TypeScript, TypeORM y PostgreSQL. Proporciona autenticación JWT, gestión de cuentas, categorías, transacciones, perfiles y llaves de API.

### Arquitectura y Módulos (`src/`):
- `modules/<domain>/`: Módulos encapsulados por dominio (`auth`, `users`, `accounts`, `categories`, `transactions`, `api-keys`).
  - `<domain>.controller.ts`: Endpoints HTTP, enrutamiento y decoradores Swagger/guards.
  - `<domain>.service.ts`: Lógica de negocio y orquestación.
  - `dto/`: Data Transfer Objects tipados con validaciones de `class-validator` y `class-transformer`.
  - `entities/`: Modelos de base de datos mapeados con TypeORM (`pg`).
- `common/`: Filtros de excepción globales, interceptores, decoradores personalizados y guards compartidos.
- `config/`: Configuración centralizada de base de datos y entorno con `@nestjs/config`.

---

## 2. Comandos de Compilación y Desarrollo

```bash
# Iniciar en modo desarrollo con recarga en vivo
npm run start:dev

# Compilar proyecto para producción
npm run build

# Formatear código con Prettier
npm run format

# Ejecutar en producción
npm run start:prod
```

---

## 3. Directrices de Estilo de Código

- **Idioma:**
  - Código, nombres de clases, métodos, variables y tablas siempre en **inglés**.
  - Mensajes de error en excepciones HTTP y respuestas hacia el cliente siempre en **español**.
- **Arquitectura NestJS:**
  - Inyección de dependencias estricta en constructores.
  - Separación de responsabilidades: los controladores solo reciben la petición y delegan al servicio correspondiente; no escribir lógica de negocio en controladores.
- **Validación de Datos:**
  - Todo endpoint debe tipar sus entradas mediante DTOs decorados con `class-validator`.
  - No usar tipos genéricos `any` en peticiones o respuestas.
- **Control de Flujo:**
  - Retornos tempranos (early return) para reducir anidaciones.
  - Manejo de errores mediante excepciones nativas de NestJS (`NotFoundException`, `BadRequestException`, `UnauthorizedException`).

---

## 4. Instrucciones de Prueba y Verificación

- **Verificación de Tipos y Compilación:** Ejecutar `npm run build` para asegurar que el compilador de Nest y TypeScript no arrojen errores de tipado o decoradores.
- **Formateo:** Ejecutar `npm run format` para mantener el estilo consistente.
- **Integridad de Base de Datos:** Validar que las relaciones entre entidades TypeORM tengan claves foráneas e índices adecuados.

---

## 5. Consideraciones de Seguridad

- **Autenticación y Guards:** Endpoints privados deben estar protegidos con el guard JWT de Passport (`@UseGuards(JwtAuthGuard)`).
- **Manejo de Contraseñas:** Encriptar credenciales usando `bcrypt` antes de persistir; nunca devolver hashes de contraseñas en las respuestas.
- **Variables de Entorno:** Credenciales de PostgreSQL, secretos JWT y puertos deben leerse exclusivamente de variables de entorno mediante `ConfigService`.

---

## 6. Flujo de Ramas, Versionado y Despliegue (CI/CD)

- **Ramas de Trabajo:**
  - **`develop`:** Rama activa de desarrollo e integración (*Staging / Preview*). Todo cambio nuevo debe commitearse en `develop` (nunca directamente en `main`).
  - **`main`:** Rama de producción protegida en GitHub. Solo recibe cambios mediante Pull Request desde `develop`.
- **Conventional Commits Obligatorios:**
  - Usar siempre prefijos semánticos (`feat:`, `fix:`, `chore:`, `ci:`, `docs:`, `refactor:`) ya que determinan el cálculo automático de versión (`SemVer`) y las notas de lanzamiento.
- **Corte de Versión y `CHANGELOG.md` Automático:**
  - No ejecutar `npm run release` manualmente antes de fusionar a `main` (para previsualizar cambios usar `npm run release:dry`).
  - Al fusionar un Pull Request de `develop` → `main`, el workflow `.github/workflows/release.yml` incrementa la versión en `package.json`, actualiza `CHANGELOG.md`, crea el tag `vX.Y.Z`, publica el GitHub Release y sincroniza el commit de regreso a `develop`.
  - Tras cada pase a producción, ejecutar `git pull --tags origin develop` y `git fetch origin main:main` para sincronizar el entorno local.
- **Despliegues en Preview / Staging (Vercel por lotes):**
  - Para ahorrar minutos y recursos gratuitos de build, los pushes ordinarios a `develop` son ignorados por Vercel (`ignoreCommand`).
  - Para desplegar un lote de cambios en el entorno de Preview, incluir la palabra clave `predeploy` (o `[predeploy]`) en el mensaje del commit:
    ```bash
    git commit -m "feat(modulo): cerrar lote de cambios [predeploy]"
    ```
  - Para disparar el despliegue de Preview sin cambios de código nuevos:
    ```bash
    git commit --allow-empty -m "ci: disparar preview [predeploy]" && git push origin develop
    ```

