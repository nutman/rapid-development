import { Module } from '@nestjs/common';
import { XmlParserService } from './xml-parser.service';

@Module({
  imports: [],
  controllers: [],
  providers: [XmlParserService],
  exports: [XmlParserService],
})
export class SharedModule {}
