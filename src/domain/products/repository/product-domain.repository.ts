import { Product } from "../entities/product.entity"

export interface ProductDomainRepository {
    create(product: Product): Promise<Product>
    get(): Promise<Product[]>
    getByID(id: string): Promise<Product>
    update(product: Product): Promise<Product>
    delete(id: string): Promise<void>
}
