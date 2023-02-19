import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  summoner: string;

  @Column({ type: 'varchar' })
  champion: string;

  @Column({ type: 'boolean' })
  win: boolean;

  @Column({ type: 'int' })
  kills: number;

  @Column({ type: 'int' })
  assists: number;

  @Column({ type: 'int' })
  deaths: number;

  @Column({type: 'varchar'})
  gameMode: string;
  
  @Column({type: 'int'})
  gameDuration: number;

  @Column({type: 'int'})
  totalMinionsKilled: number;
  
  @Column({type: 'varchar', unique:true})
  matchId: string;

  @CreateDateColumn()
  createdAt: Date
}
