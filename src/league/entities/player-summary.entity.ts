import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PlayerSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique:true })
  summonerQueue: string;

  @Column({ type: 'varchar' })
  summoner: string;

  @Column({ type: 'int' })
  kills: number;
  
  @Column({ type: 'int' })
  deaths: number;
  
  @Column({ type: 'int' })
  assists: number;
  
  @Column({ type: 'int' })
  queueId: number;
  
  @Column({ type: 'float' })
  avgCsPerMinute: number;
  
  @Column({ type: 'float' })
  avgVisionScore: number;

  @Column({ type: 'int', nullable:true })
  wins: number;

  @Column({ type: 'int', nullable:true })
  losses: number;

  @Column({ type: 'varchar', nullable:true })
  tier: string;

  @Column({ type: 'varchar', nullable:true })
  rank: string;

  @Column({ type: 'int', nullable:true })
  leaguePoints: number;

  @CreateDateColumn()
  createdAt: Date;
}
