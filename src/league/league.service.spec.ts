import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from './league.service';
import { LeagueHttpService } from './league-http.service';
import { LeagueSerializer } from './league.serializer';
import { Match } from './entities/match.entity';
import { PlayerSummary } from './entities/player-summary.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetRecentMatchesDTO } from './dto/get-recent-matches.dto';
import { mockDeep } from 'jest-mock-extended';
import { RiotMatchResponse } from './types/riot-responses/riot-match-response.type';
import { env } from 'process';
import { InsertResult, Repository } from 'typeorm';
import { mockRiotMatchResponse } from './mocks/riot-match-response-mock';
import { match } from 'assert';
import { playerSummaryRepositoryMock, playerSummaryRepositoryMockWithoutRanked } from './mocks/player-summary-repository-mock';
import {  aramMatchMock } from './mocks/match-repository-mock';

describe('LeagueService', () => {
  let service: LeagueService;
  let leagueHttpService: LeagueHttpService;
  let leagueSerializer: LeagueSerializer;
  let playerSummaryRepository: Repository<PlayerSummary>;
  let matchRepository: Repository<Match>;
  const leagueSerializerMock = mockDeep<LeagueSerializer>();

 
  beforeEach(async () => {
    jest.resetModules();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeagueService,
        {
          provide: LeagueHttpService,
          useFactory: () => ({
            getMatch: jest.fn(() => []),
            getMatchesIds: jest.fn(() => []),
            getSummoner: jest.fn(() => []),
            getAllMatches: jest.fn(() => []),
            getLeagueStats: jest.fn(() => []),
          }),
        },
        {
          provide: getRepositoryToken(Match),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PlayerSummary),
          useClass: Repository,
        },
        {
          provide: LeagueSerializer,
          useValue: leagueSerializerMock,
        },
      ],
    }).compile();

    service = module.get<LeagueService>(LeagueService);
    leagueHttpService = module.get<LeagueHttpService>(LeagueHttpService);
    leagueSerializer = module.get<LeagueSerializer>(LeagueSerializer);

    playerSummaryRepository = module.get<Repository<PlayerSummary>>(
      getRepositoryToken(PlayerSummary),
    );
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
  });

  afterEach(() => {
    process.env = env;
  });
  describe('getRecentMatches', () => {
    it('should throw when getRecentMatches is called with count greater than 100', async () => {
      const error = service.getRecentMatches({
        regionName: 'any',
        count: 500,
        summonerName: 'any',
      });
      await expect(error).rejects.toThrow(
        'RIOT API DOES NOT SUPPORT LIMIT GREATER THAN 100',
      );
    });
    it('should call MatchRepositorySerializer', async () => {
      const leagueSerializerSpy = jest.spyOn(
        leagueSerializer,
        'matchRepositorySerialize',
      );
      const allMatchesMock = {
        allMatches: [Promise.resolve(mockRiotMatchResponse)],
        puuid: 'any_puuid',
      };
      jest
        .spyOn(leagueHttpService, 'getAllMatches')
        .mockResolvedValueOnce(allMatchesMock);
      jest
        .spyOn(matchRepository, 'upsert')
        .mockResolvedValueOnce(Promise.resolve({} as InsertResult));

      await service.getRecentMatches({
        summonerName: 'any',
        regionName: 'any',
        count: 20,
      });
      expect(leagueSerializerSpy).toHaveBeenCalled();
    });
  });

  describe('leaderboards', () => {
    it('should throw when summonerName and regionName is not found', async () => {
      jest.spyOn(playerSummaryRepository, 'find').mockResolvedValueOnce([]);
      jest.spyOn(matchRepository, 'find').mockResolvedValueOnce([]);

      expect(async () => {
        await service.leaderboards({
          regionName: 'not_found',
          summonerName: 'not_found',
        });
      }).rejects.toThrow('Summoner not found');
    });

    it('should not return leaguePoints when a player doesnt have any ranked game', async ()=> {
      jest.spyOn(playerSummaryRepository, 'exist').mockResolvedValue(false)
      jest
          .spyOn(matchRepository, 'exist')
          .mockResolvedValueOnce(true);
      const leaderboard = await service.leaderboards({
        summonerName: 'any',
        regionName: 'any'
      })

      expect(leaderboard).not.toHaveProperty('leaguePoints')
      expect(leaderboard).toHaveProperty('winRate')
    })
   

    it.todo('when a player have any ranked game should return leaguePoints')

  
    it.todo('should compare winrate when calculating leaderboard for winrate');
  });
});

