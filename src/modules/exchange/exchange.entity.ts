// exchange.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExchangeOffice } from '../exchange-office/exchange-office.entity'; // Import the ExchangeOffice entity

@Entity()
export class Exchange {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExchangeOffice, (exchangeOffice) => exchangeOffice.exchanges)
  @JoinColumn({ name: 'exchange_office_id' })
  exchangeOffice: ExchangeOffice;

  @Column({ type: 'varchar', length: 3 }) // Example: EUR, USD, etc.
  from: string;

  @Column({ type: 'varchar', length: 3 }) // Example: EUR, USD, etc.
  to: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 }) // Example: 100.50
  ask: number;

  @Column({
    type: 'decimal',
    precision: 10, // Total number of digits
    scale: 2,
  }) // Example: 100.50
  profitInUsd: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
