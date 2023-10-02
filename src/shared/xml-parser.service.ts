import { Injectable } from '@nestjs/common';
import { parseString } from 'xml2js';

@Injectable()
export class XmlParserService {
  async parseXml(xmlData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}
