import { Product } from "../../domain/products/entities/product.entity";
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    qty: number;
    @ApiProperty()
    price: number;
    @ApiProperty()
    production_date: Date;
    @ApiProperty()
    description: string;
    @ApiProperty()
    created_at: Date;
    @ApiProperty()
    updated_at: Date;

    constructor(user: Product) {
        this.id = user.id;
        this.name = user.Name;
        this.qty = user.Qty;
        this.price = user.Price;
        this.production_date = user.ProductionDate;
        this.description = user.Description;
        this.created_at = user.CreatedAt;
        this.updated_at = user.UpdatedAt;
    }
}
