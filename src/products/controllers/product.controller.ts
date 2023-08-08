import { Controller, Post, Body, Res, HttpStatus, Get, NotFoundException, Param, Put, Delete } from '@nestjs/common';
import { ProductRequestDto } from '../dto/request-product.dto';
import { ProductService } from '../services/product.service';
import { logger } from '../../config/logger/logger.config';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { BadRequestResponse, ErrorResponse, MessageResponse, SuccessResponse } from 'src/config/swagger/response.swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiCreatedResponse({ description: 'Successfully create data', type: SuccessResponse })
    @ApiBadRequestResponse({ type: BadRequestResponse })
    @ApiInternalServerErrorResponse({ type: ErrorResponse })
    async create(@Body() productRequest: ProductRequestDto, @Res() response) {
        try {
            const product = await this.productService.create(productRequest)

            logger.log('info', `Product created: ${product.name}`, {
                payload: productRequest,
                functionName: 'create',
                route: '/api/products',
            });

            const apiResponse: SuccessResponse = {
                message: 'Successfully create data',
                data: product,
            };
            return response.status(HttpStatus.CREATED).json(apiResponse)
        } catch (error) {
            logger.log('error', error.message, {
                functionName: 'create',
                payload: productRequest,
                route: '/api/products',
            });
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error!'
            })
        }
    }

    @ApiOperation({ summary: 'Get a product by ID' })
    @ApiOkResponse({ description: 'Successfully fetch data', type: SuccessResponse })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiInternalServerErrorResponse({ type: ErrorResponse })
    @Get(':id')
    async getByID(@Param('id') id: string, @Res() response) {
        try {
            const product = await this.productService.getByID(id);
            logger.log('info', `Product get by ID: ${id}`, {
                functionName: 'getByID',
                route: `/api/products/${id}`,
            });

            const apiResponse: SuccessResponse = {
                message: 'Successfully fetch data',
                data: product,
            };
            return response.status(HttpStatus.OK).json(apiResponse)
        } catch (error) {
            logger.log('error', error.message, {
                functionName: 'getByID',
                route: `/api/products/${id}`,
            });

            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: error.message
                })
            }

            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error!'
            })
        }
    }

    @ApiOperation({ summary: 'Get all products' })
    @ApiOkResponse({ description: 'Successfully fetch data', type: SuccessResponse })
    @ApiInternalServerErrorResponse({ type: ErrorResponse })
    @Get()
    async get(@Res() response) {
        try {
            const product = await this.productService.get();
            logger.log('info', 'Get All Product', {
                functionName: 'get',
                route: '/api/products',
            });

            const apiResponse: SuccessResponse = {
                message: 'Successfully fetch data',
                data: product,
            };
            return response.status(HttpStatus.OK).json(apiResponse)
        } catch (error) {
            logger.log('error', error.message, {
                functionName: 'get',
                route: '/api/products',
            });

            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error!'
            })
        }
    }

    @ApiOperation({ summary: 'Update a product by ID' })
    @ApiOkResponse({ description: 'Successfully update data', type: SuccessResponse })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiInternalServerErrorResponse({ type: ErrorResponse })
    @Put(':id')
    async update(@Param('id') id: string, @Body() request: ProductRequestDto, @Res() response) {
        try {
            const product = await this.productService.update(id, request);
            logger.log('info', `Product update ID: ${id}`, {
                functionName: 'update',
                route: `/api/products/${id}`,
            });

            const apiResponse: SuccessResponse = {
                message: 'Successfully update data',
                data: product,
            };
            return response.status(HttpStatus.OK).json(apiResponse)
        } catch (error) {
            logger.log('error', error.message, {
                functionName: 'update',
                route: `/api/products/${id}`,
            });

            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: error.message
                })
            }

            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error!'
            })
        }
    }

    @ApiOperation({ summary: 'Delete a product by ID' })
    @ApiOkResponse({ description: 'Successfully delete data', type: MessageResponse })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @ApiInternalServerErrorResponse({ type: ErrorResponse })
    @Delete(':id')
    async delete(@Param('id') id: string, @Res() response) {
        try {
            await this.productService.delete(id);
            logger.log('info', `Product delete ID: ${id}`, {
                functionName: 'delete',
                route: `/api/products/${id}`,
            });
            return response.status(HttpStatus.OK).json({
                message: `Successfully delete data products ${id}`,
            })
        } catch (error) {
            logger.log('error', error.message, {
                functionName: 'delete',
                route: `/api/products/${id}`,
            });

            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: error.message
                })
            }

            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error!'
            })
        }
    }
}
