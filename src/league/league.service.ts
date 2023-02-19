import { Injectable } from '@nestjs/common';
import { GetRecentMatchesDTO } from './dto/get-recent-matches.dto';
import { PlayerSummaryDTO } from './dto/player-summary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { LeagueHttpService } from './league-http.service';
import { CategorizedMatchResponse } from './types/match-response.type';
import { LeagueSerializer } from './league.serializer';
import { PlayerSummary } from './entities/player-summary.entity';
import { PlayerSummaryResponse } from './types/player-summary-response.type';
import { tierLeagues, rank } from './constants/tier-points';
import { Leaderboards } from './types/leaderboards.type';


@Injectable()
export class LeagueService {
  constructor(
    private readonly leagueHttpService: LeagueHttpService,
    private readonly leagueSerializer: LeagueSerializer,
  ) {}

  @InjectRepository(Match)
  private readonly matchRepository: Repository<Match>;
  @InjectRepository(PlayerSummary)
  private readonly playerSummaryRepository: Repository<PlayerSummary>;

  async getRecentMatches({
    regionName,
    summonerName,
    count,
  }: GetRecentMatchesDTO): Promise<CategorizedMatchResponse> {
    if (count > 100) {
      throw new Error('RIOT API DOES NOT SUPPORT LIMIT GREATER THAN 100');
    }

    const { allMatches, puuid } = await this.leagueHttpService.getAllMatches({
      summonerName,
      regionName,
      count,
    });

    const matches = await Promise.all(allMatches);

    const repositorySerializedMatchPromises = matches.map(async (match) => {
      const mappedMatch = this.leagueSerializer.matchRepositorySerialize(
        match,
        puuid,
      );
      await this.matchRepository.upsert(mappedMatch, {
        conflictPaths: {
          matchId: true,
        },
      });

      return mappedMatch;
    });

    const repositorySerializedMatch = await Promise.all(
      repositorySerializedMatchPromises,
    );

    const serializedResponse = this.leagueSerializer.matchResponseSerialize(
      repositorySerializedMatch,
    );
    return serializedResponse;
  }

  async playerSummary({
    summonerName,
    regionName,
  }: PlayerSummaryDTO): Promise<PlayerSummaryResponse[]> {
    const { id: summonerId } = await this.leagueHttpService.getSummoner(
      summonerName,
      regionName,
    );
    const leagueStats = await this.leagueHttpService.getLeagueStats(
      summonerId,
      regionName,
    );
    const { allMatches } = await this.leagueHttpService.getAllMatches({
      summonerName,
      regionName,
    });
    const riotMatchesResponse = await Promise.all(allMatches);
    const repositorySerializedSummary =
      this.leagueSerializer.playerSummaryRepositorySerialize({
        matches: riotMatchesResponse,
        leagueStats,
        summonerName,
      });

    const promises = repositorySerializedSummary.map(async (summary) => {
      const summaryWithoutIdCreatedAt = { ...summary };
      await this.playerSummaryRepository.upsert(summary, {
        conflictPaths: {
          summonerQueue: true,
        },
      });

      return summaryWithoutIdCreatedAt;
    });
    const result = await Promise.all(promises);

    const responseSerializedSummary =
      this.leagueSerializer.playerSummaryResponseSerializer(result);
    return responseSerializedSummary;
  }

  async leaderboards({
    summonerName,
    regionName,
  })  : Promise<Leaderboards>  {
    const [summonerMatchExists, summonerSummaryExists] = await Promise.all([
      this.matchRepository.exist({
        where: {
          summoner: summonerName,
        },
      }),
      this.playerSummaryRepository.exist({
        where: {
          summoner: summonerName,
        },
      }),
    ]);

    if (!summonerMatchExists && !summonerSummaryExists) {
      throw new Error('Summoner not found');
    }

    const descMatchesRank: { summoner: string; win_rate: number }[] = await this
      .matchRepository.query(`
      SELECT summoner, 
        COUNT(*) AS total_matches, 
        SUM(CASE WHEN win THEN 1 ELSE 0 END) AS total_wins, 
        (SUM(CASE WHEN win THEN 1 ELSE 0 END)::float / COUNT(*) * 100) AS win_rate
        FROM match
      GROUP BY summoner
      ORDER BY win_rate DESC
    `);
    const winRate = descMatchesRank.indexOf(
      descMatchesRank.find((rank) => rank.summoner === summonerName),
    );

    const playersSummary = await this.playerSummaryRepository.find();

    const summonerWithLeaguePoints = playersSummary
      .map((summary) => {
        if (!summary.tier && !summary.rank) return;
        if (summary.queueId != 420) return;
        const tierRankPoints = tierLeagues[summary.tier] + rank[summary.rank];
        return {
          summonerName: summary.summoner,
          tierRankPoints,
          tier: summary.tier,
          rank: summary.rank,
          lp: summary.leaguePoints,
        };
      })
      .sort((a, b) => b.tierRankPoints - a.tierRankPoints)
      .filter((item) => item);

    const requesterSummoner = summonerWithLeaguePoints.find(
      (summoner) => summoner.summonerName === summonerName,
    );
    if (!requesterSummoner) {
      return {
        winRate: `#${winRate + 1}`,
      };
    }
    const summonerLeaguePoints =
      summonerWithLeaguePoints.indexOf(requesterSummoner);

    const sameTierSummoners = summonerWithLeaguePoints.filter((summoner) => {
      return summoner.tierRankPoints === requesterSummoner.tierRankPoints;
    });

    if (sameTierSummoners.length > 1) {
      const tierIndex = summonerWithLeaguePoints.indexOf(sameTierSummoners[0]);

      sameTierSummoners.sort((a, b) => b.lp - a.lp);

      summonerWithLeaguePoints.splice(
        tierIndex,
        sameTierSummoners.length,
        ...sameTierSummoners,
      );
    }

    return {
      winRate: `#${winRate + 1}`,
      leaguePoints:
        summonerLeaguePoints === -1
          ? undefined
          : `#${summonerLeaguePoints + 1}`,
    };
  }
}

/* "summonerWithLeaguePoints": [
		{
			"summonerName": "RED Morttheus",
			"tierRankPoints": 104,
			"tier": "CHALLENGER",
			"rank": "I",
			"lp": 1579
		},
		{
			"summonerName": "INTZ Nia",
			"tierRankPoints": 104,
			"tier": "CHALLENGER",
			"rank": "I",
			"lp": 1535
		},
		{
			"summonerName": "keio",
			"tierRankPoints": 84,
			"tier": "MASTER",
			"rank": "I",
			"lp": 224
		},
		{
			"summonerName": "jhonatan com jh",
			"tierRankPoints": 84,
			"tier": "MASTER",
			"rank": "I",
			"lp": 305
		},
		{
			"summonerName": "x AnchoR x",
			"tierRankPoints": 44,
			"tier": "SILVER",
			"rank": "I",
			"lp": 0
		},
		{
			"summonerName": "JunioZ",
			"tierRankPoints": 41,
			"tier": "SILVER",
			"rank": "IV",
			"lp": 24
		}
	], */
