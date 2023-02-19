import { CategorizedMatchResponse } from "../types/match-response.type";
import { RiotMatchResponse } from "../types/riot-responses/riot-match-response.type";

export const mockRiotMatchResponse: RiotMatchResponse = {
    metadata: {
      matchId: '123456789',
      participants: ['player1', 'player2', 'player3'],
    },
    info: {
      gameDuration: 1500,
      gameMode: 'CLASSIC',
      gameId: '987654321',
      participants: [
        {
          visionScore: 50,
          summonerName: 'player1',
          puuid: 'any_puuid',
          assists: 10,
          deaths: 2,
          kills: 15,
          win: true,
          totalMinionsKilled: 200,
          championName: 'Ahri',
          challenges: {},
        },
        {
          visionScore: 30,
          summonerName: 'player2',
          puuid: '66666666-7777-8888-9999-000000000000',
          assists: 5,
          deaths: 6,
          kills: 10,
          win: false,
          totalMinionsKilled: 150,
          championName: 'Jinx',
          challenges: {},
        },
        {
          visionScore: 20,
          summonerName: 'player3',
          puuid: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          assists: 7,
          deaths: 5,
          kills: 8,
          win: false,
          totalMinionsKilled: 180,
          championName: 'Ashe',
          challenges: {},
        },
      ],
      queueId: 440,
    },
  };
  
  export const  mockcategorizedMatchResponse: CategorizedMatchResponse =  {
    CLASSIC: [
      {
        champion: 'Ahri',
        csPerMinute: '8.0',
        gameMode: 'CLASSIC',
        kda: '15/10/2',
        win: true,
        matchId: '123456789'
      }
    ],
    ARAM: [
      {
        champion: 'Ahri',
        csPerMinute: '8.0',
        gameMode: 'ARAM',
        kda: '15/10/2',
        win: true,
        matchId: '123456789'
      }
    ]
  }