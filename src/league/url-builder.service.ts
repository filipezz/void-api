import { Injectable } from '@nestjs/common';

export type Options = {
  summonerName?: string;
  regionName?: string;
  puuid?: string;
  count?: number;
  matchId?: string;
};

export type Endpoint = 'puuid' | 'matchesIds' | 'match'

@Injectable()
export class UrlBuilderService {
  build(endpoint: Endpoint, options?: Options): string {
    const baseUrl = process.env.BASE_URL;

    const continent = this.getContinent(options?.regionName);

    switch (endpoint) {
      case 'puuid':
        return `${options?.regionName}.${baseUrl}/summoner/v4/summoners/by-name/${options?.summonerName}`;

      case 'matchesIds':
        return `${continent}.${baseUrl}/match/v5/matches/by-puuid/${options?.puuid}/ids?count=${
          options?.count || 20
        }`;

      case 'match':
        return `${continent}.${baseUrl}/match/v5/matches/${options?.matchId}`;

      default:
        throw new Error('ENDPOINT NOT AVAILABLE');
    }
  }

  getContinent(regionName: string): string {
    const regionToContinent = {
      AMERICAS: ['BR1', 'LA1', 'LA2', 'NA1'],
      EUROPE: ['EUN1, EUW1', 'RU'],
      SEA: ['OC1'],
      ASIA: [
        'KR1',
        'JP1',
        'VN2',
        'TW2',
        'PH2',
        'SG2',
        'TH1',
        'TH2',
        'TW2',
        'VN2',
      ],
    };

    const continent = Object.keys(regionToContinent).find(
      (key) => regionToContinent[key] === regionName,
    );
    return continent;
  }
}
