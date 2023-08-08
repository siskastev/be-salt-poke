import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
    @ApiProperty({ description: 'Success message', example: 'Successfully fetch data' })
    message: string;

    @ApiProperty({ description: 'result of data', example: {} })
    data: any;
}

export class ErrorResponse {
    @ApiProperty({
        example: 'Product Not Found',
        description: 'Error Exceptions',
    })
    message: string;
}

export class MessageResponse {
    @ApiProperty({
        example: 'Successfully delete data products',
        description: 'Message Response',
    })
    message: string;
}

export class BadRequestResponse {
    @ApiProperty({
        example: {
            name: [
                "Name should not be empty",
                "Name must be a string"
            ],
            qty: [
                "Qty must not be greater than 100",
                "Qty must not be less than 1",
                "Qty must be a number conforming to the specified constraints",
                "Qty should not be empty"
            ],
            price: [
                "Price must be a number conforming to the specified constraints",
                "Price should not be empty"
            ],
            production_date: [
                "Production_date must be a valid ISO 8601 date string",
                "Production_date should not be empty"
            ],
            description: [
                "Description should not be empty",
                "Description must be a string"
            ]
        },
        description: 'Validation error message',
    })
    message: Record<string, string[]>;

    @ApiProperty({
        example: 'Bad Request',
        description: 'Error message',
    })
    error: string;

    @ApiProperty({
        example: 400,
        description: 'HTTP status code',
    })
    statusCode: number;
}

