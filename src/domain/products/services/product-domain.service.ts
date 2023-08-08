import { ProductRequestDto } from "../../../products/dto/request-product.dto"
import { ProductResponseDto } from "../../../products/dto/response-product.dto"

export interface ProductDomainService {
    create(createRequest: ProductRequestDto): Promise<ProductResponseDto>
    get(): Promise<ProductResponseDto[]>
    getByID(id: string): Promise<ProductResponseDto>
    update(id: string, updateRequest: ProductRequestDto): Promise<ProductResponseDto>
    delete(id: string): Promise<void>
}
