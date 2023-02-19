import { Injectable } from '@nestjs/common';
import { RiotMatchResponse } from './types/riot-responses/riot-match-response.type';
import { Match } from './entities/match.entity';
import {
  CategorizedMatchResponse,
  MatchResponse,
} from './types/match-response.type';
import { queueTypeToQueueId } from './constants/rank-queue-id';
import { RiotLeagueStatsResponse } from './types/riot-responses/riot-league-stats-response.type';
import { PlayerSummary } from './entities/player-summary.entity';
import {
  LeagueSummaryByQueue,
  GameByQueue,
} from './types/serializer/player-summary-repository.types';
import { PlayerSummaryResponse } from './types/player-summary-response.type';

export type MatchWithoutIdAndCreatedAt = Omit<Match, 'id' | 'createdAt'>;

export type PlayerSummaryWithoutIdAndCreatedAt = Omit<
  PlayerSummary,
  'id' | 'createdAt'
>;

export type PlayerSummaryWithoutIdAndCreatedAtandSummonerQueue = Omit<
  PlayerSummary,
  'id' | 'createdAt' | 'summonerQueue'
>;
type PlayerSummaryRepositorySerialize = {
  matches: RiotMatchResponse[];
  leagueStats: RiotLeagueStatsResponse[];
  summonerName: string;
};
@Injectable()
export class LeagueSerializer {
  matchRepositorySerialize(
    matchResponse: RiotMatchResponse,
    puuid: string,
  ): MatchWithoutIdAndCreatedAt {
    const summoner = matchResponse.info.participants.find((participant) => {
      return puuid === participant.puuid;
    });
    return {
      summoner: summoner.summonerName.toLowerCase(),
      assists: summoner.assists,
      champion: summoner.championName,
      gameMode: matchResponse.info.gameMode,
      deaths: summoner.deaths,
      kills: summoner.kills,
      matchId: matchResponse.metadata.matchId,
      win: summoner.win,
      gameDuration: matchResponse.info.gameDuration,
      totalMinionsKilled: summoner.totalMinionsKilled,
    };
  }

  matchResponseSerialize(
    match: MatchWithoutIdAndCreatedAt[],
  ): CategorizedMatchResponse {
    const serializedMatches = match.map<MatchResponse>((match) => {
      const gameDurationInMinutes = match.gameDuration / 60;
      const csPerMinute =
        Number(match.totalMinionsKilled) / gameDurationInMinutes;
      const { kills, assists, deaths } = match;
      const kda = `${kills}/${assists}/${deaths}`;

      return {
        champion: match.champion,
        csPerMinute: String(csPerMinute.toFixed(1)),
        gameMode: match.gameMode,
        kda,
        win: match.win,
        matchId: match.matchId,
      };
    });

    const matchesFilteredByGameMode =
      serializedMatches.reduce<CategorizedMatchResponse>((acc, game) => {
        const { gameMode } = game;
        if (!acc[gameMode]) {
          acc[gameMode] = [];
        }
        acc[gameMode].push(game);
        return acc;
      }, {});
    return matchesFilteredByGameMode;
  }

  playerSummaryRepositorySerialize({
    matches,
    leagueStats,
    summonerName,
  }: PlayerSummaryRepositorySerialize): PlayerSummaryWithoutIdAndCreatedAt[] {
    const gamesByQueue = matches.reduce((acc, game) => {
      const { queueId, gameDuration } = game.info;
      if (!acc[queueId]) {
        acc[queueId] = [] as GameByQueue[];
      }

      const summoner = game.info.participants.find(
        (participant) => participant.summonerName.toLowerCase() === summonerName,
      );
      console.log(summonerName)
      if (!summoner) {
      
        return acc;
      }
      const gameByQueue = {
        kills: summoner.kills,
        assists: summoner.assists,
        deaths: summoner.deaths,
        totalMinionsKilled: summoner.totalMinionsKilled,
        visionScore: summoner.visionScore,
        win: summoner.win,
        gameDuration,
        gameId: game.info.gameId,
      };

      acc[queueId].push(gameByQueue);
      return acc;
    }, {} as GameByQueue);

    const sumsByQueue = {} as GameByQueue;
    for (let key in gamesByQueue) {
      let arr = gamesByQueue[key] as GameByQueue[];
      sumsByQueue[key] = arr.reduce<GameByQueue>(
        (acc, game) => {
          acc.kills += game.kills;
          acc.assists += game.assists;
          acc.deaths += game.deaths;
          acc.totalMinionsKilled += game.totalMinionsKilled;
          acc.visionScore += game.visionScore;
          acc.gameDuration += game.gameDuration;
          acc.matches = arr.length;
          return acc;
        },
        {
          kills: 0,
          assists: 0,
          deaths: 0,
          totalMinionsKilled: 0,
          visionScore: 0,
          gameDuration: 0,
          matches: 0,
        } as GameByQueue,
      );
    }

    const leagueSummaryByQueue = Object.entries(
      sumsByQueue,
    ).map<LeagueSummaryByQueue>(([queueId, data]) => ({ queueId, ...data }));

    const playerSummaryRepository: PlayerSummaryWithoutIdAndCreatedAt[] =
      leagueSummaryByQueue.map((queue) => {
        const avgCsPerMinute =
          queue.totalMinionsKilled / (queue.gameDuration / 60);
        const avgVisionScore = queue.visionScore / queue.matches;

        const queueResult = {
          summonerQueue: `${summonerName}-${queue.queueId}`,
          summoner: summonerName.toLowerCase(),
          queueId: Number(queue.queueId),
          assists: queue.assists,
          deaths: queue.assists,
          kills: queue.kills,
          avgCsPerMinute: Number(avgCsPerMinute.toFixed(1)),
          avgVisionScore: Number(avgVisionScore.toFixed(1)),
          matches: queue.matches,
        };
        if (leagueStats.length) {
          const rankedQueue = leagueStats.find(
            ({ queueType }) => queueType === queueTypeToQueueId[queue.queueId],
          );

          return {
            ...queueResult,
            losses: rankedQueue.losses,
            wins: rankedQueue.wins,
            tier: rankedQueue.tier,
            rank: rankedQueue.rank,
            leaguePoints: rankedQueue.leaguePoints,
          };
        }
        return {
          ...queueResult,
          losses: null,
          wins: null,
          tier: null,
          rank: null,
          leaguePoints: null,
        };
      });
    return playerSummaryRepository;
  }
  playerSummaryResponseSerializer(
    repositorySerializedSummary: PlayerSummaryWithoutIdAndCreatedAt[],
  ): PlayerSummaryResponse[] {
    return repositorySerializedSummary.map(
      ({ leaguePoints, losses, wins, tier, rank, summonerQueue, ...rest }) => {
        if (leaguePoints === null) {
          return {
            ...rest,
          };
        }
        return {
          leaguePoints,
          losses,
          wins,
          tier,
          rank,
          ...rest,
        };
      },
    );
  }
}
