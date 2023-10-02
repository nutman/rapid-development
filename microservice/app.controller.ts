import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('math')
export class AppController {
  // @MessagePattern({ cmd: 'sum' })
  // accumulate(data: number[]): number {
  //   return (data || []).reduce((a, b) => a + b);
  // }
  //
  // @Get('/w')
  // async getTopProfitExchangers() {
  //   return { message: 'Hello from microservice' };
  // }

  @MessagePattern({ cmd: 'sum' })
  async accumulate(data: number[]): Promise<number> {
    console.log('hello === >>>');
    return (data || []).reduce((a, b) => a + b);
  }
}
