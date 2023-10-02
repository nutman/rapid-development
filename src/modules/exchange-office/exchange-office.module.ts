import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeOffice } from './exchange-office.entity';
import { ExchangeOfficeRepository } from './exchange-office.repository';
import { ExchangeOfficeService } from './exchange-office.service';
import { ExchangeOfficeController } from './exchange-office.controller';
import { SharedModule } from '../../shared/shared.module';
import { CountryModule } from '../country/country.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([ExchangeOffice, ExchangeOfficeRepository]),
    CountryModule,
  ],
  controllers: [ExchangeOfficeController],
  providers: [ExchangeOfficeService],
  exports: [ExchangeOfficeService],
})
export class ExchangeOfficeModule {}
