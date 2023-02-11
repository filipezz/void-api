import { Injectable } from '@nestjs/common';
import { GetRecentMachesDTO } from './dto/get-recent-matches.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { LeagueHttpService } from './league-http.service';
import { MatchReponse } from './types/match-response.type';
import {LeagueSerializer} from './league.serializer'

@Injectable()
export class LeagueService {
  constructor(
    private readonly leagueHttpService: LeagueHttpService,
    private readonly leagueSerializer: LeagueSerializer
  ) {}

  @InjectRepository(Match)
  private readonly repository: Repository<Match>;
  async getRecentMaches({
    regionName,
    summonerName,
    count,
  }: GetRecentMachesDTO): Promise<MatchReponse[]> {
    if (count > Number(process.env.MATCHES_MAX_LIMITS)) {
      throw new Error(
        'RIOT API DOES NOT SUPPORT LIMIT GREATER THAN' +
          process.env.MATCHES_MAX_LIMITS,
      );
    }
    const puuid = await this.leagueHttpService.getPuuid(summonerName, regionName);
    const matchesIds = await this.leagueHttpService.getMatchesIds(puuid, count);
    
    const getAllMatches = matchesIds.map(async (matchId) => {
      const isSameMatchId = {
        where: {
          matchId: matchId,
        },
      };
      const match = await this.leagueHttpService.getMatch(matchId);
      const matchAlreadyExists = await this.repository.exist(isSameMatchId);

      if (!matchAlreadyExists) {
        const mappedMatch = this.leagueSerializer.matchRepositorySerialize(match, puuid);
        await this.repository.save(mappedMatch);
      }
      return await this.repository.findOne(isSameMatchId);
    })

    const matches = await Promise.all(getAllMatches);

    const serializedResponse = this.leagueSerializer.matchResponseSerialize(matches);
    return serializedResponse;
  }
}
