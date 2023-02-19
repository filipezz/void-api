import { Test, TestingModule } from '@nestjs/testing';
import {
  LeagueSerializer,
  MatchWithoutIdAndCreatedAt,
} from './league.serializer';
import { mockRiotMatchResponse, mockcategorizedMatchResponse } from './mocks/riot-match-response-mock';

const expectedMatch: MatchWithoutIdAndCreatedAt = {
    summoner: 'player1',
    assists: 10,
    champion: 'Ahri',
    gameMode: 'CLASSIC',
    deaths: 2,
    kills: 15,
    matchId: '123456789',
    win: true,
    gameDuration: 1500,
    totalMinionsKilled: 200,
  };
const expectedMatch2:MatchWithoutIdAndCreatedAt ={
    ...expectedMatch,
    gameMode:"ARAM"
}
describe('LeagueSerializer', () => {
  let leagueSerializer: LeagueSerializer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeagueSerializer],
    }).compile();

    leagueSerializer = module.get<LeagueSerializer>(LeagueSerializer);
  });
  describe('matchRepositorySerialize', () => {
    it('should return expected value', () => {
      expect(
        leagueSerializer.matchRepositorySerialize(
          mockRiotMatchResponse,
          'any_puuid',
        ),
      ).toEqual(expectedMatch);
    });
  });
  describe('matchResponseSerialize', () => {
    it('should return expected value', () => {
        expect(
        leagueSerializer.matchResponseSerialize(
            [expectedMatch, expectedMatch2]
        ),
      ).toEqual(mockcategorizedMatchResponse);
    });
  });
});
