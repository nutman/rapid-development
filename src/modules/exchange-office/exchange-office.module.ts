import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeOffice } from './exchange-office.entity';
import { ExchangeOfficeRepository } from './exchange-office.repository';
import { ExchangeOfficeService } from './exchange-office.service';
import { ExchangeOfficeController } from './exchange-office.controller';
import { SharedModule } from '../../shared/shared.module';
import { CountryModule } from '../country/country.module';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

@Module({
  imports: [
    SharedModule,

    TypeOrmModule.forFeature([ExchangeOffice, ExchangeOfficeRepository]),

    CountryModule,
  ],
  controllers: [ExchangeOfficeController],
  providers: [
    ExchangeOfficeService,
    {
      provide: 'MATH_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'microservice',
            port: 4000,
          },
        });
      },
    },
  ],
  exports: [ExchangeOfficeService],
})
export class ExchangeOfficeModule {}
