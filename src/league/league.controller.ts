import {
  Controller,
  Query,
  Get,
  UseInterceptors,
  CacheInterceptor
} from '@nestjs/common';
import { LeagueService } from './league.service';
import { GetRecentMachesDTO } from './dto/get-recent-matches.dto';
import { LeagueAuthenticatorInterceptor } from '../interceptors/league-authenticator.interceptor';

@UseInterceptors(LeagueAuthenticatorInterceptor)
@Controller('riot')
export class LeagueController {
  constructor(private readonly riotService: LeagueService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/recent-matches')
  getRecentMaches(
    @Query() { count,regionName,summonerName } : GetRecentMachesDTO,
  ) {
    return this.riotService.getRecentMaches({
      count,
      regionName,
      summonerName,
    });
  }
}
