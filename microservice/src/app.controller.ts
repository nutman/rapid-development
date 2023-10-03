import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { exchangeRates } from './exchange-rates';
import { CachingService } from './caching/caching.service';

@Controller('math')
export class AppController {
  constructor(private readonly cachingService: CachingService) {}

  @MessagePattern({ cmd: 'get-rates' })
  async accumulate(): Promise<any> {
    const cachedValue = await this.cachingService.get('EXCHANGE_RATES');

    if (cachedValue) {
      console.log('Got from Cache');
      return cachedValue;
    }

    // Make some 3rd party API call and cache it in this case it was imported from exchange-rates.ts
    console.log('Made some 3rd party API call and cache it');
    await this.cachingService.set(
      'EXCHANGE_RATES',
      JSON.stringify(exchangeRates),
    );
    return exchangeRates;
  }

  @MessagePattern({ cmd: 'hello' })
  async hello(): Promise<any> {
    return 'hello';
  }
}
