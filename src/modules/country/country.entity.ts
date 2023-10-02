import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ExchangeOffice } from '../exchange-office/exchange-office.entity'; // Import the ExchangeOffice entity

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 3, unique: true })
  code: string;

  @Column()
  name: string;

  @OneToMany(
    () => ExchangeOffice,
    (exchangeOffice) => exchangeOffice.countryCode,
  )
  exchangeOffices: ExchangeOffice[];
}
