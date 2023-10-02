import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rate } from './rate.entity';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
  ) {}

  async findAll(): Promise<Rate[]> {
    return this.rateRepository.find();
  }

  async findOneById(id: FindOneOptions<Rate>): Promise<Rate | undefined> {
    return this.rateRepository.findOne(id);
  }

  async create(rateData: Partial<Rate>): Promise<Rate> {
    const newRate = this.rateRepository.create(rateData);
    return this.rateRepository.save(newRate);
  }

  async update(id: number, rateData: Partial<Rate>): Promise<Rate | undefined> {
    await this.rateRepository.update(id, rateData);
    return this.rateRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.rateRepository.delete(id);
  }
}
