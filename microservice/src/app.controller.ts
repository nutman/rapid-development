import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { exchangeRates } from './exchange-rates';

@Controller('math')
export class AppController {
  @MessagePattern({ cmd: 'get-rates' })
  async accumulate(): Promise<any> {
    return exchangeRates;
  }

  @MessagePattern({ cmd: 'hello' })
  async hello(): Promise<any> {
    return 'hello';
  }
}
