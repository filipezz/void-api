import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  champion: string;

  @Column({ type: 'boolean' })
  win: boolean;

  @Column({ type: 'varchar' })
  kda: string;

  @Column({ type: 'varchar' })
  kills: string;

  @Column({ type: 'varchar' })
  assists: string;

  @Column({ type: 'varchar' })
  csPerMinute: string;

  @Column({type: 'varchar'})
  gameMode: string;

  @Column({type: 'varchar'})
  matchId: string;

  @CreateDateColumn()
  createdAt: Date
}
