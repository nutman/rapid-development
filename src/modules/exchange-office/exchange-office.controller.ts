import { Controller, Get, Param } from '@nestjs/common';
import { XmlParserService } from '../../shared/xml-parser.service';
import { ExchangeOfficeService } from './exchange-office.service';
import { CountryService } from '../country/country.service';
import { UtilsService } from '../../shared/utils.service';
import { exchangeRates } from './exchange-rates';

@Controller('db')
export class ExchangeOfficeController {
  constructor(
    private readonly xmlParserService: XmlParserService,
    private readonly exchangeOfficeService: ExchangeOfficeService,
    private readonly countryService: CountryService,
    private readonly utilsService: UtilsService,
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
      const xmlData = await this.xmlParserService.parseXmlFile(
        __dirname + '/../database-dump.xml',
      );

      const parsedData = await this.xmlParserService.parseXml(xmlData);

      if (parsedData) {
        const data = this.xmlParserService.mapXmlDataToExchangeOffice(
          parsedData,
          exchangeRates,
        );
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
}
