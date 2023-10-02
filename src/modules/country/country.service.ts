import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  async findOneById(id: number): Promise<Country | undefined> {
    return this.countryRepository.findOneBy({ id });
  }

  async findOneByCode(code: string): Promise<Country | undefined> {
    return this.countryRepository.findOne({ where: { code } });
  }

  async create(countryData: Partial<Country[]>): Promise<Country[]> {
    return this.countryRepository.save(countryData);
  }

  async update(
    id: number,
    countryData: Partial<Country>,
  ): Promise<Country | undefined> {
    await this.countryRepository.update(id, countryData);
    return this.countryRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.countryRepository.delete(id);
  }
}
