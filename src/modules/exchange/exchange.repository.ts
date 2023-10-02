import { EntityRepository, Repository } from 'typeorm';
import { Exchange } from './exchange.entity';

@EntityRepository(Exchange)
export class ExchangeRepository extends Repository<Exchange> {}
