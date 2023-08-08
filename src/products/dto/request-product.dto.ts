import {
    IsString,
    IsNotEmpty,
    Length,
    IsDateString,
    IsNumber,
    Min,
    Max,
    Matches
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductRequestDto {
    @ApiProperty({
        example: 'Product Name',
        description: 'The name of the product',
    })
    @IsNotEmpty()
    @IsString()
    @Length(5, 100)
    @Matches(/^[a-zA-Z0-9 ]*$/, {
        message: 'name must contain only letters, numbers, and spaces',
    })
    name: string;

    @ApiProperty({
        example: 10,
        description: 'The quantity of the product',
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    qty: number;

    @ApiProperty({
        example: 10000,
        description: 'The price of the product',
    })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({
        example: '2023-08-06',
        description: 'The production date of the product format YYYY-MM-DD',
    })
    @IsNotEmpty()
    @IsDateString()
    production_date: Date;

    @ApiProperty({
        example: 'Product Description',
        description: 'The description of the product',
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}
