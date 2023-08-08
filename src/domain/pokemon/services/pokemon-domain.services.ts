export interface PokemonDomainService {
    getPokemonData(pathType: string, offset: number, limit: number, path: string): Promise<any>
}
