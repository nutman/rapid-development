import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ExchangeOffice } from './exchange-office.entity';
import path from 'path';
import { XmlParserService } from '../../shared/xml-parser.service';

@Injectable()
export class ExchangeOfficeService {
  constructor(
    @InjectRepository(ExchangeOffice)
    private readonly exchangeOfficeRepository: Repository<ExchangeOffice>,
    private readonly connection: Connection,
  ) {}

  async findAll(): Promise<ExchangeOffice[]> {
    return this.exchangeOfficeRepository.find();
  }

  async findOneById(id: number): Promise<ExchangeOffice | undefined> {
    return this.exchangeOfficeRepository.findOneBy({ id });
  }

  async create(exchangeOffices: ExchangeOffice[]): Promise<ExchangeOffice[]> {
    return await this.exchangeOfficeRepository.save(exchangeOffices);
  }

  async update(
    id: number,
    exchangeOfficeData: Partial<ExchangeOffice>,
  ): Promise<ExchangeOffice | undefined> {
    await this.exchangeOfficeRepository.update(id, exchangeOfficeData);
    return this.exchangeOfficeRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.exchangeOfficeRepository.delete(id);
  }

  async getTopProfitExchangers() {
    // Build the query to calculate profit and filter by the last month
    // const queryBuilder: SelectQueryBuilder<ExchangeOffice> =
    //   this.exchangeOfficeRepository.createQueryBuilder('exchangeOffice');

    // queryBuilder
    //   .select('eo.country_code, SUM(e."profitInUsd") as profit')
    //   .addSelect('SUM(e."profitInUsd")', 'total_profit')
    //   .from(ExchangeOffice, 'eo')
    //   .innerJoin(Exchange, 'e', 'eo.id = e.exchange_office_id')
    //   .where('e.date >= :lastMonthDate', { lastMonthDate })
    //   .groupBy('eo.country_code')
    //   .orderBy('profit', 'DESC')
    //   .limit(3);
    //
    // const topProfitExchangers = await queryBuilder.getRawMany();

    const connection = this.connection.createQueryRunner();
    const formattedDate = this.getLastMonthDate();
    const topProfitExchangers =
      await connection.query(`SELECT eo.country_code, SUM(e."profitInUsd") as profit
                              FROM exchange_office eo
                                       INNER JOIN exchange e ON eo.id = e.exchange_office_id
                              WHERE e.date >= '${formattedDate}'
                              GROUP BY eo.country_code
                              ORDER BY profit DESC
                                  LIMIT 3;`);
    return topProfitExchangers;
  }

  getTopProfitExchangersByCountryCode(countryCode: string) {
    const formattedDate = this.getLastMonthDate();

    const connection = this.connection.createQueryRunner();
    return connection.query(`SELECT eo.id, eo.name, eo.country_code, SUM(e."profitInUsd") as total_profit
                             FROM exchange_office eo
                                      INNER JOIN exchange e ON eo.id = e.exchange_office_id
                             WHERE e.date >= '${formattedDate}' AND eo.country_code = '${countryCode}'
                             GROUP BY eo.id, eo.name, eo.country_code

                                 LIMIT 3;`);

    //     return connection.query(`select * from exchange_office
    // where country_code = '${countryCode}' and e.date >= '${formattedDate}'`);
  }

  getLastMonthDate() {
    const currentDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(currentDate.getMonth() - 1);
    return lastMonthDate.toISOString().slice(0, 19).replace('T', ' ');
  }
}
