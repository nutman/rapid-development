import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from './modules/country/country.module';
import { ExchangeModule } from './modules/exchange/exchange.module';
import { RateModule } from './modules/rate/rate.module';
import { ExchangeOfficeModule } from './modules/exchange-office/exchange-office.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'your_password',
      database: 'mydatabase',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      logging: true,
    }),
    CountryModule,
    ExchangeModule,
    ExchangeOfficeModule,
    RateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
