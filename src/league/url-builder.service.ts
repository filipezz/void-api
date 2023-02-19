import { Injectable } from '@nestjs/common';
import { regionToContinent } from './constants/region-to-continent';

export type Options = {
  summonerName?: string;
  regionName?: string;
  puuid?: string;
  count?: number;
  matchId?: string;
  summonerId?: string;
};

export type Endpoint = 'summoner' | 'matchesIds' | 'match' | 'league';

@Injectable()
export class UrlBuilderService {
  build(endpoint: Endpoint, options?: Options): string {
    const baseUrl = process.env.LEAGUE_BASE_URL;
    const continent = this.getContinent(options?.regionName);

    switch (endpoint) {
      case 'summoner':
        return `${options?.regionName}.${baseUrl}/summoner/v4/summoners/by-name/${options?.summonerName}`;

      case 'matchesIds':
        return `${continent}.${baseUrl}/match/v5/matches/by-puuid/${
          options?.puuid
        }/ids?count=${options?.count || 20}`;

      case 'match':
        return `${continent}.${baseUrl}/match/v5/matches/${options?.matchId}`;

      case 'league':
        return `${options?.regionName}.${baseUrl}/league/v4/entries/by-summoner/${options?.summonerId}`;
      default:
        throw Error('ENDPOINT NOT AVAILABLE');
    }
  }

  getContinent(regionName: string): string {
    for (const key in regionToContinent) {
      if (regionToContinent[key].includes(regionName)) {
        return key;
      }
    }
  }
}
