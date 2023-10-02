import { Injectable } from '@nestjs/common';
import { parseString } from 'xml2js';
import { ExchangeOffice } from '../modules/exchange-office/exchange-office.entity';
import { Country } from '../modules/country/country.entity';
import { Rate } from '../modules/rate/rate.entity';
import { Exchange } from '../modules/exchange/exchange.entity';
import { UtilsService } from './utils.service';
import * as fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

@Injectable()
export class XmlParserService {
  constructor(private readonly utilsService: UtilsService) {}
  async parseXml(xmlData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async parseXmlFile(filePath: string): Promise<any> {
    try {
      return await readFileAsync(filePath);
    } catch (error) {
      throw new Error('Failed to read or parse XML file');
    }
  }

  mapXmlDataToExchangeOffice(
    data: any,
    exchangeRates,
  ): {
    ExchangeOffices: ExchangeOffice[];
    Countries: Country[];
  } {
    const exchangeOfficesData =
      data.database['exchange-offices'][0]['exchange-office'];
    const countriesData = data.database['countries'][0]['country'];

    const exchangeOffices: ExchangeOffice[] = [];

    for (const exchangeData of exchangeOfficesData) {
      const exchangeOffice = new ExchangeOffice();
      exchangeOffice.name = exchangeData.name[0];
      exchangeOffice.countryCode = exchangeData.country[0];
      // Map other properties from XML data to the ExchangeOffice entity

      // Map rates for this exchange office
      exchangeOffice.rates = exchangeData.rates[0].rate.map((rateData) => {
        const rate = new Rate();
        rate.from = rateData.from[0];
        rate.to = rateData.to[0];
        rate.in = parseFloat(rateData.in);
        rate.out = parseFloat(rateData.out);
        rate.reserve = parseFloat(rateData.reserve);
        rate.date = rateData.date;

        return rate;
      });

      exchangeOffice.exchanges = exchangeData.exchanges?.[0].exchange.map(
        (exchangeData) => {
          const exchange = new Exchange();
          exchange.from = exchangeData.from[0];
          exchange.to = exchangeData.to[0];
          exchange.ask = parseFloat(exchangeData.ask);
          exchange.date = exchangeData.date;
          exchange.profitInUsd = this.utilsService.calculateProfit(
            parseFloat(exchangeData.ask),
            exchangeRates,
            exchangeData.from[0],
            exchangeData.to[0],
          ); // UAH to USD exchange

          return exchange;
        },
      );

      exchangeOffices.push(exchangeOffice);
      // Map country for this exchange office
    }

    const countries: Country[] = [];
    for (const countryData of countriesData) {
      const country = new Country();
      country.code = countryData.code[0];
      country.name = countryData.name[0];

      countries.push(country);
    }

    return { ExchangeOffices: exchangeOffices, Countries: countries };
  }
}
