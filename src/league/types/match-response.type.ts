import { Match } from '../entities/match.entity'

export type MatchResponse = Omit<Match, 'id' | 'createdAt' | 'gameDuration' | "totalMinionsKilled" | "summoner" | "kills"| "assists"|"deaths"> & 
{
    kda:string;
    csPerMinute:string;
};

export type CategorizedMatchResponse = { [key in string]: MatchResponse[] }