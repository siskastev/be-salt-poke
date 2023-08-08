import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDomainService } from '../../domain/products/services/product-domain.service';
import { ProductRequestDto } from '../dto/request-product.dto';
import { ProductResponseDto } from '../dto/response-product.dto';
import { Product } from '../../domain/products/entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class ProductService implements ProductDomainService {

    constructor(
        private readonly productRepository: ProductRepository,
        private readonly redisService: RedisService) { }

    async create(request: ProductRequestDto): Promise<ProductResponseDto> {
        const product = this.mappingProduct(request);
        const result = await this.productRepository.create(product)
        await this.redisService.removeFromCache('products');
        return new ProductResponseDto(result)
    }

    private mappingProduct(request: ProductRequestDto): Product {
        const product = new Product();
        product.Name = request.name.trim();
        product.Qty = request.qty;
        product.Price = request.price;
        product.ProductionDate = request.production_date;
        product.Description = request.description.trim();
        return product;
    }

    async getByID(id: string): Promise<ProductResponseDto> {
        const result = await this.productRepository.getByID(id)
        if (!result) {
            throw new NotFoundException('Product not found');
        }
        return new ProductResponseDto(result)
    }

    async get(): Promise<ProductResponseDto[]> {
        const cachedProducts = await this.redisService.getFromCache('products');
        if (cachedProducts) {
            return cachedProducts;
        }

        const products = await this.productRepository.get();

        await this.redisService.saveToCache('products', products);

        return products.map((product) => new ProductResponseDto(product));
    }

    async update(id: string, request: ProductRequestDto): Promise<ProductResponseDto> {
        const existingProduct = await this.productRepository.getByID(id);
        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        const product = this.mappingProduct(request);
        product.id = id
        const result = await this.productRepository.update(product)
        await this.redisService.removeFromCache('products');
        return new ProductResponseDto(result)
    }

    async delete(id: string): Promise<void> {
        const existingProduct = await this.productRepository.getByID(id);
        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        await this.productRepository.delete(id)
        await this.redisService.removeFromCache('products');
    }
}
