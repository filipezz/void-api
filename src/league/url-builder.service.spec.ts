import { Test, TestingModule } from '@nestjs/testing';
import { UrlBuilderService, Endpoint, Options } from './url-builder.service';
import { regionToContinent } from './constants/region-to-continent';

describe('LeagueService', () => {
  let service: UrlBuilderService;

  const availableOptions = {
    count: 10,
    matchId: 'any_id',
    puuid: 'any_puuid',
    regionName: 'BR1',
    summonerName: 'any_summoner_name',
    expectedContinen: 'AMERICAS',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlBuilderService],
    }).compile();

    service = module.get<UrlBuilderService>(UrlBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('build', () => {
    it('should return a region in url if called with `summoner` or `league`', () => {
      const summonerEndpoint = 'summoner';
      const summonerEndpointUrl = service.build(summonerEndpoint, {
        regionName: availableOptions.regionName,
      });
      let urlContainsRegion = summonerEndpointUrl.includes(availableOptions.regionName);

      expect(urlContainsRegion).toBeTruthy();

      const leagueEndpoint = 'league';
      const leagueEndpointUrl = service.build(leagueEndpoint, {
        regionName: availableOptions.regionName,
      });
       urlContainsRegion = leagueEndpointUrl.includes(availableOptions.regionName);

      expect(urlContainsRegion).toBeTruthy();
    });

    it('should return a continent in url if called with `matchesIds` or `match`', () => {
      const matchesIdsEndpoint = 'matchesIds';
      const matchesIdsUrl = service.build(matchesIdsEndpoint, {
        regionName: availableOptions.regionName,
      });
      const matchesIdsUrlContinent = service.getContinent(
        availableOptions.regionName,
      );
      const matchesIdsUrlContains = matchesIdsUrl.includes(
        matchesIdsUrlContinent,
      );

      
      expect(matchesIdsUrlContains).toBeTruthy();
      const matchEndpoint = 'match';
      const matchIdUrl = service.build(matchEndpoint, {
        regionName: availableOptions.regionName,
      });
      const matchIdContinent = service.getContinent(
        availableOptions.regionName,
      );
      const matchUrlContains = matchIdUrl.includes(matchIdContinent);

      expect(matchUrlContains).toBeTruthy();
    });
  });

  describe('getContinent', () => {
    Object.keys(regionToContinent).forEach((continent) => {
      Object.values<string>(regionToContinent[continent]).forEach((region) => {
        it(`should return ${continent} when region name is ${region}`, () => {
          const result = service.getContinent(region);
          expect(result).toBe(continent);
        });
      });
    });
  });
});
