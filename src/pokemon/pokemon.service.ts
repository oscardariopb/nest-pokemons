import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {

    this.defaultLimit = configService.get<number>('defaultLimit');
    console.log({ defaultLimit: this.defaultLimit })
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      console.log('createPokemonDto', createPokemonDto)
      return pokemon;

    } catch (error) {
      console.log('error', error)
      // if (error.code === 11000) {
      //   throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
      // }
      // throw new InternalServerErrorException(`Can't create Pokemon - Check logs`)
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find({}).limit(limit).skip(offset).sort({ no: 1 }).select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no: ${term} not found`);
    return pokemon;

    /*
      async findOne(term: string) {
      const pokemon = await this.pokemonModel.findOne({
        $or: [
          ...(!isNaN(+term) ? [{ no: term }] : []),
          ...(isValidObjectId(term) ? [{ _id: term }] : []),
          { name: term.toLowerCase().trim() },
        ],
      });
  
      if (!pokemon)
        throw new NotFoundException(
          `Pokemon with id, name or no ${term} not found`,
        );
  
      return pokemon;
    }
  */
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);//, { new: true } regresa el valor 
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      console.log('error', error)
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id); //#2 sol usndo el uuid de mongo

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    //return `This action removes a #${id} pokemon`;
    if (deletedCount === 0) {
      throw new BadRequestException(`pokemon with id ${id} not found`);
    }
    return `This action removes no #${id} pokemon`;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists with data in db ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Can't update Pokemon - Check logs`)
  }
}
