import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../domain/products/entities/product.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), RedisModule],
    controllers: [ProductController],
    providers: [ProductRepository, ProductService]
})
export class ProductsModule { }
