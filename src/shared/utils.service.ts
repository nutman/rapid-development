import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  calculateProfit(
    initialAmount: number,
    er: Record<
      string,
      { [targetCurrency: string]: { buyRate: number; sellRate: number } }
    >,
    baseCurrency: string,
    targetCurrency: string,
  ) {
    const exchangeRates = er;
    const rates = exchangeRates[baseCurrency];
    console.log('exchangeRates', rates, baseCurrency, rates[baseCurrency]);

    if (!rates || !rates[targetCurrency]) {
      throw new Error('Invalid exchange pair or rates not available.');
    }

    const buyRate = rates[targetCurrency].buyRate;
    const sellRate = rates[targetCurrency].sellRate;

    // Calculate the amount in the target currency based on the sell rate
    const amountOfProfitInBaseCurrency =
      initialAmount -
      initialAmount *
        buyRate *
        exchangeRates[targetCurrency][baseCurrency].buyRate;

    // Calculate the equivalent amount in USD based on the buy rate of the target currency
    const profitInUSD =
      amountOfProfitInBaseCurrency * exchangeRates[baseCurrency].USD.buyRate;

    // I'm not sure how profit rate in usd should be calculated
    // Calculate the equivalent amount in USD based on the average buy rate and sell rate of the target currency
    //const profitInUSD = amountOfProfitInBaseCurrency * (this.exchangeRates[baseCurrency].USD.buyRate + this.exchangeRates[baseCurrency].USD.sellRate) / 2;

    return profitInUSD;
  }
}
