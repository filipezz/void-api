import { Injectable } from '@nestjs/common';
import { RiotMatchReponse } from './types/riot-responses/riot-match-response.type';
import { HttpService } from '../http/http-service';
import { UrlBuilderService } from './url-builder.service';

@Injectable()
export class LeagueHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly urlBuilderService: UrlBuilderService,
  ) {}

  async getPuuid(summonerName: string, regionName: string): Promise<string> {
    const url = this.urlBuilderService.build('puuid', {
      summonerName,
      regionName,
    });
    const { puuid } = await this.httpService.get<{ puuid: string }>(url);

    return puuid;
  }

  async getMatchesIds(puuid: string, count?: number): Promise<string[]> {
    const url = this.urlBuilderService.build('matchesIds', { puuid, count });
    const matchesIds = await this.httpService.get<string[]>(url);
    return matchesIds;
  }

  async getMatch(matchId: string): Promise<RiotMatchReponse> {
    const url = this.urlBuilderService.build('match', { matchId });
    const match = await this.httpService.get<RiotMatchReponse>(url);
    return match;
  }
}
