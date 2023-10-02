import { Controller, Get, Param } from '@nestjs/common';
import { XmlParserService } from '../../shared/xml-parser.service';
import * as fs from 'fs';
import { promisify } from 'util';
import { ExchangeOfficeService } from './exchange-office.service';
import { ExchangeOffice } from './exchange-office.entity';
import { Rate } from '../rate/rate.entity';
import { Country } from '../country/country.entity';
import { CountryService } from '../country/country.service';
import { Exchange } from '../exchange/exchange.entity';

const readFileAsync = promisify(fs.readFile);

const exchangeRates = {
  USD: {
    EUR: { buyRate: 0.85, sellRate: 0.87 },
    UAH: { buyRate: 37, sellRate: 38.5 },
    GBP: { buyRate: 1.2, sellRate: 1.25 },
    USD: { buyRate: 1, sellRate: 1 },
  },
  EUR: {
    USD: { buyRate: 1.15, sellRate: 1.18 },
    UAH: { buyRate: 28, sellRate: 30 },
    GBP: { buyRate: 1.35, sellRate: 1.38 },
    EUR: { buyRate: 1, sellRate: 1 },
  },
  UAH: {
    USD: { buyRate: 0.026, sellRate: 0.028 },
    EUR: { buyRate: 0.032, sellRate: 0.034 },
    GBP: { buyRate: 0.041, sellRate: 0.043 },
    UAH: { buyRate: 1, sellRate: 1 },
  },
  GBP: {
    USD: { buyRate: 0.79, sellRate: 0.81 },
    EUR: { buyRate: 0.73, sellRate: 0.75 },
    UAH: { buyRate: 22.5, sellRate: 23 },
    GBP: { buyRate: 1, sellRate: 1 },
  },
};

@Controller('db')
export class ExchangeOfficeController {
  constructor(
    private readonly xmlParserService: XmlParserService,
    private readonly exchangeOfficeService: ExchangeOfficeService,
    private readonly countryService: CountryService,
  ) {}

  @Get('/xml/:data')
  async parseXml(@Param('data') xmlData: string) {
    try {
      const parsedData = await this.xmlParserService.parseXml(xmlData);
      // Process the parsed data as needed
      return { parsedData };
    } catch (error) {
      // Handle parsing errors
      throw new Error('Failed to parse XML data');
    }
  }

  @Get('/xml-from-file')
  async parseXmlFromLocalFile() {
    try {
      const xmlData = await this.parseXmlFile(
        __dirname + '/../database-dump.xml',
      );

      const parsedData = await this.xmlParserService.parseXml(xmlData);

      if (parsedData) {
        const data = this.mapXmlDataToExchangeOffice(parsedData);
        await this.countryService.create(data.Countries);
        await this.exchangeOfficeService.create(data.ExchangeOffices);
      }
      // Process the parsed data as needed
      return { message: 'Data saved' };
    } catch (error) {
      // Handle parsing errors
      throw new Error(`Failed to parse XML data, ${error}`);
    }
  }

  @Get('/top-profit-exchangers')
  async getTopProfitExchangers() {
    const topExchangeCountries =
      await this.exchangeOfficeService.getTopProfitExchangers();

    const res = [];

    for await (const topExchangeCountry of topExchangeCountries) {
      const office =
        await this.exchangeOfficeService.getTopProfitExchangersByCountryCode(
          topExchangeCountry['country_code'],
        );
      res.push(office);
    }

    return res;
  }

  async parseXmlFile(filePath: string): Promise<any> {
    try {
      return await readFileAsync(filePath);
    } catch (error) {
      throw new Error('Failed to read or parse XML file');
    }
  }

  private mapXmlDataToExchangeOffice(data: any): {
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
          exchange.profitInUsd = this.calculateProfit(
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
      console.log(countryData);
      country.code = countryData.code[0];
      country.name = countryData.name[0];

      countries.push(country);
    }

    return { ExchangeOffices: exchangeOffices, Countries: countries };
  }

  calculateProfit(
    initialAmount: number,
    exchangeRates: Record<
      string,
      { [targetCurrency: string]: { buyRate: number; sellRate: number } }
    >,
    baseCurrency: string,
    targetCurrency: string,
  ) {
    const rates = exchangeRates[baseCurrency];

    if (!rates || !rates[targetCurrency]) {
      throw new Error('Invalid exchange pair or rates not available.');
    }

    const buyRate = rates[targetCurrency].buyRate;
    const sellRate = rates[targetCurrency].sellRate;

    // Calculate the amount in the target currency based on the sell rate
    const amountOfProfitInBaseCurrency =
      initialAmount -
      initialAmount *
        buyRate *
        exchangeRates[targetCurrency][baseCurrency].buyRate;

    // Calculate the equivalent amount in USD based on the buy rate of the target currency
    const profitInUSD =
      amountOfProfitInBaseCurrency * exchangeRates[baseCurrency].USD.buyRate;

    // I'm not sure how profit rate in usd should be calculated
    // Calculate the equivalent amount in USD based on the average buy rate and sell rate of the target currency
    //const profitInUSD = amountOfProfitInBaseCurrency * (this.exchangeRates[baseCurrency].USD.buyRate + this.exchangeRates[baseCurrency].USD.sellRate) / 2;

    return profitInUSD;
  }
}
