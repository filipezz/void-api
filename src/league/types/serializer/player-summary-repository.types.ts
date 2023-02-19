export interface GameByQueue {
  assists: number;
  deaths: number;
  win: boolean;
  visionScore: number;
  gameDuration: number;
  totalMinionsKilled: number;
  matches: number;
  kills: number;
}

export interface LeagueSummaryByQueue {
  queueId: string;
  assists: number;
  deaths: number;
  kills: number;
  totalMinionsKilled: number;
  visionScore: number;
  gameDuration: number;
  matches: number;
}

