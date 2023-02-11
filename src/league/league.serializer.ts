import { Injectable } from '@nestjs/common';
import { RiotMatchReponse } from './types/riot-responses/riot-match-response.type';
import { Match } from './entities/match.entity';
import { MatchReponse } from './types/match-response.type';


type MatchWithoudIdAndCreatedAt = Omit<Match, 'id' | 'createdAt'>;

@Injectable()
export class LeagueSerializer {
  matchRepositorySerialize(matchReponse: RiotMatchReponse, puuid: string): MatchWithoudIdAndCreatedAt {
    const summoner = matchReponse.info.participants.find(
      (participant) => {
        return  puuid === participant.puuid
      }
    );

    return {
      assists: String(summoner.assists),
      champion: summoner.championName,
      csPerMinute: '1000000000000000000000000000',
      gameMode: matchReponse.info.gameMode,
      kda: `${summoner.kills}/${summoner.deaths}/${summoner.assists}`,
      kills: String(summoner.kills),
      matchId: matchReponse.metadata.matchId,
      win: summoner.win
    };
  }

  matchResponseSerialize(match: Match[]): MatchReponse[] {
    const result = match.map<MatchReponse>((item) => ({
      assists: item.assists,
      champion: item.champion,
      csPerMinute: Number(item.csPerMinute).toFixed(2),
      gameMode: item.gameMode,
      kda: item.kda,
      kills: item.kills,
      win: item.win,
      matchId: item.matchId,
    }));

    return result;
  }
}
  
