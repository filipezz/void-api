import {
  Controller,
  Query,
  Get,
  UseInterceptors,
  CacheInterceptor,
  UseFilters,
} from '@nestjs/common';
import { LeagueService } from './league.service';
import { GetRecentMatchesDTO } from './dto/get-recent-matches.dto';
import { LeagueAuthenticatorInterceptor } from '../interceptors/league-authenticator.interceptor';
import { HttpExceptionFilter } from './http-exception-filter';

@UseInterceptors(LeagueAuthenticatorInterceptor)
@Controller('league')
@UseFilters(HttpExceptionFilter) 
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/recent-matches')
  getRecentMatches(
    @Query() { count, regionName, summonerName }: GetRecentMatchesDTO,
  ) {
    return this.leagueService.getRecentMatches({
      count,
      regionName,
      summonerName: summonerName.toLowerCase(),
    });
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/player-summary')
  playerSummary(
    @Query() { regionName, summonerName }: GetRecentMatchesDTO,
  ) {

    
    return this.leagueService.playerSummary({ regionName, summonerName: summonerName.toLowerCase() });
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/leaderboard')
  leaderboard(
    @Query() { regionName, summonerName }: GetRecentMatchesDTO,
  ) {
    return this.leagueService.leaderboards({ regionName, summonerName: summonerName.toLowerCase() });
  }
}
