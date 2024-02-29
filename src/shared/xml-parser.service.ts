import { Injectable } from '@nestjs/common';
import { parseString } from 'xml2js';
import { ExchangeOffice } from '../modules/exchange-office/exchange-office.entity';
import { Country } from '../modules/country/country.entity';
import { Rate } from '../modules/rate/rate.entity';
import { Exchange } from '../modules/exchange/exchange.entity';
import { UtilsService } from './utils.service';
import * as fs from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import yaml from 'yaml';

const readFileAsync = promisify(fs.readFile);

interface ParsedObject {
  [key: string]: string | ParsedObject;
}

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

  async getDataFromFile(filePath: string): Promise<string> {
    const extname = path.extname(filePath);

    let parsedData: any = '';

    switch (extname) {
      case '.xml':
        const xmlData = await this.parseXmlFile('./database-dump.xml');
        parsedData = await this.parseXml(xmlData);
        break;
      case '.yml':
        const file = fs.readFileSync(filePath, 'utf-8').toString();
        const lines = file.split('\n');
        const currentObject: any = {};
        const map = new Map();

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const [indent, content] = line.match(/^(\s*)(.*)/).slice(1);
          if (!content.length) {
            continue;
          }
          const indentLevel = indent.length / 2; // Assuming 2 spaces for each level of indentation
          let parent = currentObject;

          for (let i = 0; i < indentLevel; i++) {
            parent = parent[map.get(i)];
            if (parent && parent[parent.length - 1].hasOwnProperty(content)) {
              parent.push({});
            }
            parent = parent[parent.length - 1];
          }

          if (content.includes('=')) {
            const [key, value] = content.split('=').map((str) => str.trim());
            parent[key] = value;
          } else {
            const obj = parent[content] || {};
            parent[content] = [obj];
            map.set(indentLevel, content);
          }
        }
        parsedData = currentObject;

        break;

      default:
        break;
    }

    return parsedData;
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
    const exchangeOfficesData = data['exchange-offices'];
    const countriesData = data['countries'];

    const exchangeOffices: ExchangeOffice[] = [];

    for (const ed of exchangeOfficesData) {
      const exchangeData = ed['exchange-office'][0];

      const exchangeOffice = new ExchangeOffice();
      exchangeOffice.name = exchangeData.name;
      exchangeOffice.countryCode = exchangeData.country;
      // Map other properties from XML data to the ExchangeOffice entity

      // Map rates for this exchange office
      exchangeOffice.rates = exchangeData.rates.map((r) => {
        const rateData = r.rate[0];
        const rate = new Rate();
        rate.from = rateData.from;
        rate.to = rateData.to;
        rate.in = parseFloat(rateData.in);
        rate.out = parseFloat(rateData.out);
        rate.reserve = parseFloat(rateData.reserve);
        rate.date = rateData.date;

        return rate;
      });

      exchangeOffice.exchanges = exchangeData.exchanges?.map((ed) => {
        const exchangeData = ed.exchange[0];
        const exchange = new Exchange();
        exchange.from = exchangeData.from;
        exchange.to = exchangeData.to;
        exchange.ask = parseFloat(exchangeData.ask);
        exchange.date = exchangeData.date;
        exchange.profitInUsd = this.utilsService.calculateProfit(
          parseFloat(exchangeData.ask),
          exchangeRates,
          exchangeData.from,
          exchangeData.to,
        ); // UAH to USD exchange

        return exchange;
      });

      exchangeOffices.push(exchangeOffice);
      // Map country for this exchange office
    }

    const countries: Country[] = [];
    for (const c of countriesData) {
      const countryData = c['country'][0];
      const country = new Country();
      country.code = countryData.code;
      country.name = countryData.name;

      countries.push(country);
    }

    return { ExchangeOffices: exchangeOffices, Countries: countries };
  }
}
