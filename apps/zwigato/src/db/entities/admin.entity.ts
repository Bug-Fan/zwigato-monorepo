import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  adminId: string;

  @Column('text')
  adminName: string;

  @Column('text')
  adminEmail: string;

  @Column('text')
  adminPassword: string;

  @CreateDateColumn()
  adminCreatedAt: Date;
}
