type SummaryResponseWithRankedStats = {
  summoner: string;
  kills: number;
  deaths: number;
  assists: number;
  queueId: number;
  avgCsPerMinute: number;
  avgVisionScore: number;
  wins: number;
  losses: number;
  tier: string;
  rank: string;
  leaguePoints: number;
}

type SummaryResponseWithoutRankedStats = {
    summoner: string;
    kills: number;
    deaths: number;
    assists: number;
    queueId: number;
    avgCsPerMinute: number;
    avgVisionScore: number;
}

export type PlayerSummaryResponse = SummaryResponseWithRankedStats | SummaryResponseWithoutRankedStats
