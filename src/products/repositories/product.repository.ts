import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../domain/products/entities/product.entity';
import { ProductDomainRepository } from '../../domain/products/repository/product-domain.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository implements ProductDomainRepository {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async create(product: Product): Promise<Product> {
        return this.productRepository.save(product)
    }

    async getByID(id: string): Promise<Product> {
        return this.productRepository.findOneBy({ id: id })
    }

    async get(): Promise<Product[]> {
        return this.productRepository.find()
    }

    async update(product: Product): Promise<Product> {
        return this.productRepository.save(product)
    }

    async delete(id: string): Promise<void> {
        this.productRepository.delete(id)
    }

}