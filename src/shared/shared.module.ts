import { Module } from '@nestjs/common';
import { XmlParserService } from './xml-parser.service';
import { UtilsService } from './utils.service';

@Module({
  imports: [],
  controllers: [],
  providers: [XmlParserService, UtilsService],
  exports: [XmlParserService, UtilsService],
})
export class SharedModule {}
