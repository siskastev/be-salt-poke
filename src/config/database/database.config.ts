import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs('database', (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["dist/**/entities/*.entity{ .ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    synchronize: false,
    autoLoadEntities: true,
    logging: true,
    migrationsRun: true
}));