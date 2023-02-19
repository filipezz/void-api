import { Module } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { LeagueSerializer } from './league.serializer';
import { HttpService } from '../http/http-service';
import { LeagueHttpService } from './league-http.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { UrlBuilderService } from './url-builder.service';
import { HttpModule } from '@nestjs/axios';
import { PlayerSummary } from './entities/player-summary.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    TypeOrmModule.forFeature([PlayerSummary]),
    HttpModule,
  ],
  controllers: [LeagueController],
  providers: [
    LeagueService,
    LeagueSerializer,
    HttpService,
    LeagueHttpService,
    UrlBuilderService,
  ],
})
export class LeagueModule {}
