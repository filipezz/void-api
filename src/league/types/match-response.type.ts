import { Match } from '../entities/match.entity'

export type MatchReponse = Omit<Match, 'id' | 'createdAt'>;
