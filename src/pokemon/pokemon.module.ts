import { Module } from '@nestjs/common';
import { PokemonController } from './controller/pokemon.controller';
import { PokemonService } from './services/pokemon.service';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [PokemonController],
    providers: [PokemonService]
})
export class PokemonModule { }
