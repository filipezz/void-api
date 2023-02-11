export interface RiotMatchReponse {
  metadata: Metadata
  info: Info;
}

type Info = {
  gameDuration: number;
  gameMode: string;
  gameId: string;
  participants: Participants[]
}

type Metadata = {
  matchId: string;
  participants: string[]
}

type Participants = {
  puuid: string;
  assists: number;
  deaths: number;
  kills: number;
  win: boolean;
  totalMinionsKilled: number;
  championName: string;
  challenges: {
  }

}