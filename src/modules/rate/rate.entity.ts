import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExchangeOffice } from '../exchange-office/exchange-office.entity'; // Import the ExchangeOffice entity

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column('decimal', { precision: 10, scale: 2 })
  in: number;

  @Column('decimal', { precision: 10, scale: 2 })
  out: number;

  @Column('integer')
  reserve: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => ExchangeOffice, (exchangeOffice) => exchangeOffice.rates)
  @JoinColumn({ name: 'exchange_office_id' })
  exchangeOffice: ExchangeOffice;
}
