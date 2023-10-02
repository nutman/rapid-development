import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rate } from './rate.entity';
import { RateRepository } from './rate.repository';
import { RateService } from './rate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rate, RateRepository])],
  controllers: [],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
