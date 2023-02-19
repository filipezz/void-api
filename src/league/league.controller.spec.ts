import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { CACHE_MANAGER } from '@nestjs/common';
import { GetRecentMatchesDTO } from './dto/get-recent-matches.dto';

describe('LeagueController', () => {
  let leagueController: LeagueController;
  let leagueService: LeagueService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [
        {
          provide: LeagueService,
          useFactory: () => ({
            getRecentMatches: jest.fn(() => []),
          })
        },
        {
          provide: CACHE_MANAGER,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    leagueController = module.get<LeagueController>(LeagueController);
    leagueService = module.get<LeagueService>(LeagueService);
  });
  describe('getRecentMatches', () => {
    it('should call service with correct parameters', async () => {
      const dto: GetRecentMatchesDTO = {
        count: 5,
        regionName: 'euw1',
        summonerName: 'summoner123',
      };

      await leagueController.getRecentMatches(dto);

      expect(leagueService.getRecentMatches).toHaveBeenCalledWith({
        count: dto.count,
        regionName: dto.regionName,
        summonerName: dto.summonerName,
      });
    });
  });
});

