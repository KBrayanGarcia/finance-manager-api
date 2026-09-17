import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const isSslRequired =
      process.env.DB_SSL === 'true' ||
      Boolean(process.env.POSTGRES_URL?.includes('sslmode=require')) ||
      Boolean(process.env.DATABASE_URL?.includes('sslmode=require'));

    const connectionUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    const baseConfig: TypeOrmModuleOptions = {
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      ssl: isSslRequired ? { rejectUnauthorized: false } : false,
    };

    if (connectionUrl) {
      return {
        ...baseConfig,
        url: connectionUrl,
      };
    }

    return {
      ...baseConfig,
      host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || process.env.DB_USERNAME || 'postgres',
      password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DATABASE || process.env.DB_DATABASE || 'finance_db',
    };
  },
);

