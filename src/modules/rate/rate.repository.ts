import { EntityRepository, Repository } from 'typeorm';
import { Rate } from './rate.entity';

@EntityRepository(Rate)
export class RateRepository extends Repository<Rate> {}
