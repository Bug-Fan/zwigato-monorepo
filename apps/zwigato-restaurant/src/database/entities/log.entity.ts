import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  requestId: number;

  @Column({ nullable: true })
  host: string;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column({ nullable: true, type: 'text' })
  query: string;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true, default: null })
  response: string;
}
