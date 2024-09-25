import { Injectable } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // private readonly axios: AxiosInstance = axios;
  constructor(@InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>,
    private readonly httpAdapter: AxiosAdapter) {

  }

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.httpAdapter.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);

    const pokemonsToInsert: { name: string, no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      // console.log({ name, no });
      pokemonsToInsert.push({ name, no });
    });

    const newArray = await this.pokemonModel.insertMany(pokemonsToInsert);

    // const insertPromisesArray = [];
    // data.results.forEach(async ({ name, url }) => {
    //   //console.log({ name, url })
    //   const segments = url.split('/');
    //   const no: number = +segments[segments.length - 2];
    //   // const pokemon = await this.pokemonModel.create({ name, no }); 1 a 1
    //   insertPromisesArray.push(this.pokemonModel.create({ name, no })); //2
    //   console.log({ name, no });
    // });

    // const newArray = await Promise.all(insertPromisesArray);
    return 'Seed Executed';
  }
}
