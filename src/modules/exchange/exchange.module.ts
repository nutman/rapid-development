import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { ExchangeRepository } from './exchange.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange, ExchangeRepository])],
  controllers: [],
  providers: [],
})
export class ExchangeModule {}
