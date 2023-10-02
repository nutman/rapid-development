import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Rate } from '../rate/rate.entity'; // Import the Rate entity
import { Country } from '../country/country.entity';
import { Exchange } from '../exchange/exchange.entity'; // Import the Country entity

@Entity()
export class ExchangeOffice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @OneToOne(() => Country, {
  //   eager: true,
  //   cascade: true,
  // })
  // @JoinColumn({ name: 'country', referencedColumnName: 'code' })
  // country: Country;

  @Column({ name: 'country_code', type: 'varchar', length: 3 }) // Custom column for country code
  countryCode: string; // Store the country code as a string

  // @OneToOne(() => Country, { cascade: true, onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'country_code', referencedColumnName: 'code' }) // Join using the country code
  // country: Country;

  @OneToMany(() => Rate, (rate) => rate.exchangeOffice, {
    eager: true,
    cascade: true,
  })
  rates: Rate[];

  @OneToMany(() => Exchange, (exchange) => exchange.exchangeOffice, {
    eager: true,
    cascade: true,
  })
  exchanges: Exchange[];

  @ManyToOne(() => Country, (country) => country.exchangeOffices)
  countryEntity: Country;
}
