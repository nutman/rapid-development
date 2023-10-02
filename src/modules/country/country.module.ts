import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { CountryRepository } from './country.repository';
import { CountryService } from './country.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country, CountryRepository])],
  controllers: [],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
