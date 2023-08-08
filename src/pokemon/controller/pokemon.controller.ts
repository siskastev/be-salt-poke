import { Controller, Get, Query, HttpStatus, Res } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';
import { logger } from '../../config/logger/logger.config';
import { ErrorResponse, SuccessResponse } from 'src/config/swagger/response.swagger';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiInternalServerErrorResponse } from '@nestjs/swagger';

@ApiTags('Pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @ApiOperation({ summary: 'Get all Pokemon or specific Pokemon by name or ID' })
  @ApiQuery({ name: 'type', required: false, enum: ['pokemon', 'pokemon-species', 'type'], description: 'The type of data to fetch (pokemon, species, or type)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination default 0', example: 20 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit for pagination default 20', example: 20 })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Keyword to search for specific Pokemon' })
  @ApiOkResponse({ description: 'Successfully fetch data', type: SuccessResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get()
  async get(
    @Query('type') type: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Query('q') keyword: string,
    @Res() response,
  ) {
    try {
      const result = await this.pokemonService.getPokemonData(
        type,
        offset,
        limit,
        keyword,
      );

      const apiResponse: SuccessResponse = {
        message: 'Successfully fetch data',
        data: !keyword ? result.results : result,
      };
      return response.status(HttpStatus.OK).json(apiResponse);
    } catch (error) {
      logger.log('error', error.message, {
        functionName: 'get',
        route: `/api/pokemon?type=${type}&offset=${offset}&limit=${limit}&q=${keyword}`,
      });
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error!',
      });
    }
  }
}
