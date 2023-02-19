import { LeagueHttpService } from './league-http.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('LeagueHttpService', () => {
  let leagueHttpService: LeagueHttpService;
  let puuid = 'any_puuid';
  let summonerName = 'any_summoner';
  let regionName = 'any_region_name';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
      ],
    }).compile();

    leagueHttpService = module.get<LeagueHttpService>(LeagueHttpService);
  });

  it('should call LeagueHttpService.getMatch with correct params', async () => {
    await leagueHttpService.getMatch('anyMatchId', 'regionName');
    expect(leagueHttpService.getMatch).toHaveBeenCalledWith(
      'anyMatchId',
      'regionName',
    );
  });

  it('should call LeagueHttpService.getSummoner with correct params', async () => {
    await leagueHttpService.getSummoner(summonerName, regionName);
    expect(leagueHttpService.getSummoner).toHaveBeenCalledWith(
      summonerName,
      regionName,
    );
  });

  it('should call LeagueHttpService.getMatchesIds with correct params', async () => {
    await leagueHttpService.getMatchesIds(puuid, regionName);
    expect(leagueHttpService.getMatchesIds).toHaveBeenCalledWith(
      puuid,
      regionName,
    );
  });

  it('should call League.getAllMatches', async () => {
    await leagueHttpService.getAllMatches({ summonerName, regionName });
    expect(leagueHttpService.getAllMatches).toHaveBeenCalledWith({
      regionName,
      summonerName,
    });
  });

  it('should call League.getLeagueStats with correct params', async () => {
    await leagueHttpService.getLeagueStats(summonerName, regionName);
    expect(leagueHttpService.getLeagueStats).toHaveBeenCalledWith(
      summonerName,
      regionName,
    );
  });

  it('should call League.getSummoner with correct params', async () => {
    await leagueHttpService.getSummoner(summonerName, regionName);
    expect(leagueHttpService.getSummoner).toBeCalledWith(
      summonerName,
      regionName,
    );
  });
});
