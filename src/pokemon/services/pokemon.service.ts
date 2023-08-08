import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokemonDomainService } from '../../domain/pokemon/services/pokemon-domain.services';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class PokemonService implements PokemonDomainService {

    constructor(private readonly redisService: RedisService) {}

    async getPokemonData(
        pathType: string = 'pokemon',
        offset: number = 0,
        limit: number = 20,
        path: string,
    ): Promise<any> {
        const redisKey = `pokemon_${pathType}_${offset}_${limit}_${path}`;
        const cachedData = await this.redisService.getFromCache(redisKey);
        if (cachedData) {
            return cachedData;
        }

        let apiUrl = `https://pokeapi.co/api/v2/${pathType}`;
        if (path) {
            apiUrl = `${apiUrl}/${path}`;
        }

        const response = await axios.get(apiUrl, {
            params: {
                offset,
                limit,
            },
        });

        await this.redisService.saveToCache(redisKey, response.data);
        
        return response.data;
    }
}
