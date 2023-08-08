import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from '../src/pokemon/services/pokemon.service';
import { RedisService } from '../src/redis/redis.service';
import axios from 'axios';

describe('PokemonService', () => {
    let pokemonService: PokemonService;
    let redisService: RedisService;
    let axiosGetSpy: jest.SpyInstance;
    let redisSaveSpy: jest.SpyInstance;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PokemonService,
                {
                    provide: RedisService,
                    useValue: {
                        getFromCache: jest.fn(),
                        saveToCache: jest.fn(),
                    },
                },
            ],
        }).compile();

        pokemonService = moduleRef.get<PokemonService>(PokemonService);
        redisService = moduleRef.get<RedisService>(RedisService);
        axiosGetSpy = jest.spyOn(axios, 'get');
        redisSaveSpy = jest.spyOn(redisService, 'saveToCache');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data from API and save to Redis if not available in Redis', async () => {
        const apiData = { name: 'Pikachu' };
        jest.spyOn(redisService, 'getFromCache').mockResolvedValue(null);
        axiosGetSpy.mockResolvedValue({ data: apiData });

        const result = await pokemonService.getPokemonData('pokemon', 0, 20, 'pikachu');

        // Assertion
        expect(result).toEqual(apiData);
        expect(redisSaveSpy).toHaveBeenCalledWith(
            'pokemon_pokemon_0_20_pikachu',
            apiData
        );
    });
});
