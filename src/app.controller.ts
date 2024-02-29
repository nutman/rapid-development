import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/setting') // Define a route parameter ':id' in the AppController
  getParam(): string {
    return 'setting 1';
  }
  @Get('/setting') // Define a route parameter ':id' in the AppController
  getParam12345(): string {
    return 'setting 2';
  }

  @Get(':id') // Define a route parameter ':id' in the AppController
  getParam12(@Param('id') id: string): string {
    return 'id' + id;
  }

  @Get(':address') // Define a route parameter ':id' in the AppController
  getAddress(@Param('address') id: string): string {
    return 'address' + id;
  }
}
