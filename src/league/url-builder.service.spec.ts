import { Test, TestingModule } from '@nestjs/testing';
import { UrlBuilderService, Endpoint, Options } from './url-builder.service';

describe('RiotService', () => {
  let service: UrlBuilderService;

  const availableOptions: Options = {
    count: 10,
    matchId: 'any_id',
    puuid: 'any_puuid',
    regionName: 'BR1',
    summonerName: 'any_summoner_name'
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

  it('should return a region in url if called with puuid', () => {
    const endpoint = 'puuid'
    const url = service.build(endpoint, {regionName: availableOptions.regionName});
    const urlContainsContinent = url.includes(availableOptions.regionName)

    expect(urlContainsContinent).toBeTruthy()
  });

  it('should return a continent in url if called with matchesIds and match', () => {
    const matchesIdsEndpoint = 'matchesIds'
    const matchesIdsUrl = service.build(matchesIdsEndpoint, {regionName: availableOptions.regionName});
    const matchesIdsUrlContinent = service.getContinent(availableOptions.regionName)
    const matchesIdsUrlContains = matchesIdsUrl.includes(matchesIdsUrlContinent)

    expect(matchesIdsUrlContains).toBeTruthy()

    const matchEndpoint = 'match'
    const matchIdUrl = service.build(matchEndpoint, {regionName: availableOptions.regionName});
    const matchIdContinent = service.getContinent(availableOptions.regionName)
    const matchUrlContains = matchIdUrl.includes(matchIdContinent)

    expect(matchUrlContains).toBeTruthy()
  });
});
