import { Test } from '@nestjs/testing';
import { ProductService } from 'src/products/services/product.service';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { RedisService } from 'src/redis/redis.service';
import { NotFoundException } from '@nestjs/common';
import { ProductRequestDto } from 'src/products/dto/request-product.dto';
import { ProductResponseDto } from 'src/products/dto/response-product.dto';
import { Product } from 'src/domain/products/entities/product.entity';

describe('ProductService', () => {
    let productService: ProductService;
    let productRepository: ProductRepository;
    let redisService: RedisService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: ProductRepository,
                    useValue: {
                        create: jest.fn(),
                        getByID: jest.fn(),
                        get: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: RedisService,
                    useValue: {
                        getFromCache: jest.fn(),
                        saveToCache: jest.fn(),
                        removeFromCache: jest.fn(),
                    },
                },
            ],
        }).compile();

        productService = moduleRef.get<ProductService>(ProductService);
        productRepository = moduleRef.get<ProductRepository>(ProductRepository);
        redisService = moduleRef.get<RedisService>(RedisService);
    });

    describe('create', () => {
        it('should be defined', () => {
            expect(productService).toBeDefined();
        });

        it('should create a product and return the created product', async () => {
            const request: ProductRequestDto = {
                name: 'Product 1',
                qty: 10,
                price: 1000,
                production_date: new Date(),
                description: 'Description 1',
            };
            const product: Product = {
                id: undefined,
                Name: 'Product 1',
                Qty: 10,
                Price: 1000,
                ProductionDate: new Date(),
                Description: 'Description 1',
                CreatedAt: undefined,
                UpdatedAt: undefined,
            };
            const expectedResult: ProductResponseDto = new ProductResponseDto(product);

            jest.spyOn(productRepository, 'create').mockResolvedValueOnce(product);
            jest.spyOn(redisService, 'removeFromCache').mockResolvedValueOnce(undefined);

            const result = await productService.create(request);

            expect(productRepository.create).toHaveBeenCalledWith(product);
            expect(redisService.removeFromCache).toHaveBeenCalledWith('products');
            expect(result).toEqual(expectedResult);
        });
    });

    describe('getByID', () => {
        it('should throw NotFoundException if product is not found', async () => {
            const id = '1';

            jest.spyOn(productRepository, 'getByID').mockResolvedValueOnce(undefined);

            await expect(productService.getByID(id)).rejects.toThrowError(NotFoundException);
            expect(productRepository.getByID).toHaveBeenCalledWith(id);
        });

        it('should get a product by ID', async () => {
            const id = '1';
            const product: Product = {
                id: "1",
                Name: 'Product 1',
                Qty: 10,
                Price: 1000,
                ProductionDate: new Date(),
                Description: 'Description 1',
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            };

            const expectedResult: ProductResponseDto = new ProductResponseDto(product);
            jest.spyOn(productRepository, 'getByID').mockResolvedValueOnce(product);

            const result = await productService.getByID(id);

            expect(productRepository.getByID).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('get', () => {
        it('should return products', async () => {
            const products: Product[] = [
                {
                    id: '1',
                    Name: 'Product 1',
                    Qty: 10,
                    Price: 1000,
                    ProductionDate: new Date(),
                    Description: 'Description 1',
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                },
                {
                    id: '2',
                    Name: 'Product 2',
                    Qty: 20,
                    Price: 2000,
                    ProductionDate: new Date(),
                    Description: 'Description 2',
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                }
            ];
            const expectedResult: ProductResponseDto[] = [
                new ProductResponseDto(products[0]),
                new ProductResponseDto(products[1]),
            ];

            jest.spyOn(redisService, 'getFromCache').mockResolvedValueOnce(undefined);
            jest.spyOn(productRepository, 'get').mockResolvedValueOnce(products);
            jest.spyOn(redisService, 'saveToCache').mockResolvedValueOnce(undefined);

            const result = await productService.get();

            expect(redisService.getFromCache).toHaveBeenCalledWith('products');
            expect(productRepository.get).toHaveBeenCalled();
            expect(redisService.saveToCache).toHaveBeenCalledWith('products', products);
            expect(result).toEqual(expectedResult);
        });

        it('should return cached products', async () => {
            const products: Product[] = [
                {
                    id: '1',
                    Name: 'Product 1',
                    Qty: 10,
                    Price: 1000,
                    ProductionDate: new Date(),
                    Description: 'Description 1',
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                },
                {
                    id: '2',
                    Name: 'Product 2',
                    Qty: 20,
                    Price: 2000,
                    ProductionDate: new Date(),
                    Description: 'Description 2',
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                }
            ];
            const expectedResult: ProductResponseDto[] = [
                new ProductResponseDto(products[0]),
                new ProductResponseDto(products[1]),
            ];

            jest.spyOn(redisService, 'getFromCache').mockResolvedValueOnce(expectedResult);

            const result = await productService.get();

            expect(redisService.getFromCache).toHaveBeenCalledWith('products');
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update a product and return the updated product', async () => {
            const id = '1';
            const request: ProductRequestDto = {
                name: 'Product 2',
                qty: 20,
                price: 2000,
                production_date: new Date(),
                description: 'Description 2',
            };
            const existingProduct: Product = {
                id: '1',
                Name: 'Product 1',
                Qty: 10,
                Price: 1000,
                ProductionDate: new Date(),
                Description: 'Description 1',
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            };
            const updatedProduct: Product = {
                id: id,
                Name: request.name,
                Qty: request.qty,
                Price: request.price,
                ProductionDate: request.production_date,
                Description: request.description,
                CreatedAt: undefined,
                UpdatedAt: undefined
            };
            const expectedResult: ProductResponseDto = new ProductResponseDto(updatedProduct);

            jest.spyOn(productRepository, 'getByID').mockResolvedValueOnce(existingProduct);
            jest.spyOn(productRepository, 'update').mockResolvedValueOnce(updatedProduct);
            jest.spyOn(redisService, 'removeFromCache').mockResolvedValueOnce(undefined);

            const result = await productService.update(id, request);

            expect(productRepository.getByID).toHaveBeenCalledWith(id);
            expect(productRepository.update).toHaveBeenCalledWith(updatedProduct);
            expect(redisService.removeFromCache).toHaveBeenCalledWith('products');
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException if product is not found', async () => {
            const id = '1';
            const request: ProductRequestDto = {
                name: 'Product 1',
                qty: 10,
                price: 1000,
                production_date: new Date(),
                description: 'Description 1',
            };

            jest.spyOn(productRepository, 'getByID').mockResolvedValueOnce(undefined);

            await expect(productService.update(id, request)).rejects.toThrowError(NotFoundException);
            expect(productRepository.getByID).toHaveBeenCalledWith(id);
        });
    });

    describe('delete', () => {
        it('should delete a product', async () => {
            const id = '1';
            const existingProduct: Product = {
                id: '1',
                Name: 'Product 1',
                Qty: 10,
                Price: 1000,
                ProductionDate: new Date(),
                Description: 'Description 1',
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            };

            jest.spyOn(productRepository, 'getByID').mockResolvedValueOnce(existingProduct);
            jest.spyOn(productRepository, 'delete').mockResolvedValueOnce(undefined);
            jest.spyOn(redisService, 'removeFromCache').mockResolvedValueOnce(undefined);

            await productService.delete(id);

            expect(productRepository.getByID).toHaveBeenCalledWith(id);
            expect(productRepository.delete).toHaveBeenCalledWith(id);
            expect(redisService.removeFromCache).toHaveBeenCalledWith('products');
        });

        it('should throw NotFoundException if product is not found', async () => {
            const id = '1';

            jest.spyOn(productRepository, 'getByID').mockResolvedValueOnce(undefined);

            await expect(productService.delete(id)).rejects.toThrowError(NotFoundException);
            expect(productRepository.getByID).toHaveBeenCalledWith(id);
        });
    });
});