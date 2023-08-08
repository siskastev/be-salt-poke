import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database/database.config';
import { ProductsModule } from './products/products.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ProductsModule,
    PokemonModule,
  ],
  providers: [
    {
      provide: APP_GUARD, // Use APP_GUARD to apply the RateLimitGuard globally
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
