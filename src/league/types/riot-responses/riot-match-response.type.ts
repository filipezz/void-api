export interface RiotMatchResponse {
  metadata: Metadata
  info: Info;
}

export type Info = {
  gameDuration: number;
  gameMode: string;
  gameId: string;
  participants: Participant[],
  queueId:number
}

type Metadata = {
  matchId: string;
  participants: string[]
}

export type Participant = {
  visionScore:number;
  summonerName:string;
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