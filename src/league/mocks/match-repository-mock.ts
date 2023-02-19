import { Match } from "../entities/match.entity";

export const aramMatchMock: Match[] = [
    {
        summoner: 'Hyz',
        assists: 17,
        champion: 'Irelia',
        gameMode: 'ARAM',
        deaths: 10,
        kills: 15,
        matchId: 'BR1_2682517201',
        win: true,
        gameDuration: 1076,
        totalMinionsKilled: 89,
        id: '52de9508-9a58-4112-92a9-a09604810cbf',
        createdAt:new Date()
      },
      {
        summoner: 'Hyz',
        assists: 13,
        champion: 'Zed',
        gameMode: 'ARAM',
        deaths: 8,
        kills: 7,
        matchId: 'BR1_2682836671',
        win: true,
        gameDuration: 1044,
        totalMinionsKilled: 40,
        id: 'aa69bc01-1272-454d-be82-d4c5245e6f0c',
        createdAt:new Date()
      },
      {
        summoner: 'Hyz',
        assists: 19,
        champion: 'AurelionSol',
        gameMode: 'ARAM',
        deaths: 13,
        kills: 13,
        matchId: 'BR1_2682516902',
        win: false,
        gameDuration: 1308,
        totalMinionsKilled: 87,
        id: 'c681babc-765b-42d2-bb74-3d6d2af2765d',
        createdAt:new Date()
      }
]