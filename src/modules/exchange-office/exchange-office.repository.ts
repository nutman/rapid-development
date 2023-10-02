import { EntityRepository, Repository } from 'typeorm';
import { ExchangeOffice } from './exchange-office.entity';

@EntityRepository(ExchangeOffice)
export class ExchangeOfficeRepository extends Repository<ExchangeOffice> {}
