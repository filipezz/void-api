import { Injectable } from '@nestjs/common';
import { RiotMatchResponse } from './types/riot-responses/riot-match-response.type';
import { HttpService } from '../http/http-service';
import { UrlBuilderService } from './url-builder.service';
import { RiotLeagueStatsResponse } from './types/riot-responses/riot-league-stats-response.type';

interface RiotSummonerResponse {
  puuid: string;
  id: string;
  profileIcon: number;
}

@Injectable()
export class LeagueHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly urlBuilderService: UrlBuilderService,
  ) {}

  async getSummoner(
    summonerName: string,
    regionName: string,
  ): Promise<RiotSummonerResponse> {
    const url = this.urlBuilderService.build('summoner', {
      summonerName,
      regionName,
    });
    const { puuid, id, profileIcon } =
      await this.httpService.get<RiotSummonerResponse>(url);

    return { puuid, id, profileIcon };
  }

  async getMatchesIds(
    puuid: string,
    regionName: string,
    count?: number,
  ): Promise<string[]> {
    const url = this.urlBuilderService.build('matchesIds', {
      puuid,
      count,
      regionName,
    });
    const matchesIds = await this.httpService.get<string[]>(url);
    return matchesIds;
  }

  async getMatch(
    matchId: string,
    regionName: string,
  ): Promise<RiotMatchResponse> {
    const url = this.urlBuilderService.build('match', { matchId, regionName });
    const match = await this.httpService.get<RiotMatchResponse>(url);
    return match;
  }

  async getLeagueStats(
    summonerId: string,
    regionName: string,
  ): Promise<RiotLeagueStatsResponse[]> {
    const url = this.urlBuilderService.build('league', {
      summonerId,
      regionName,
    });
    const stats = await this.httpService.get<RiotLeagueStatsResponse[]>(url);
    return stats;
  }

  async getAllMatches({
    summonerName,
    regionName,
    count,
  }: {
    summonerName: string;
    regionName: string;
    count?: number;
  }): Promise<{ allMatches: Promise<RiotMatchResponse>[]; puuid: string }> {
    const { puuid } = await this.getSummoner(summonerName, regionName);
    const matchesIds = await this.getMatchesIds(puuid, regionName, count);

    const allMatches = matchesIds.map(async (matchId) => {
      const match = await this.getMatch(matchId, regionName);
      return match;
    });
    return { allMatches, puuid };
  }
}
