import { CacheModule, Module } from '@nestjs/common';
import { LeagueModule } from './league/league.module';
import { LeagueAuthenticatorInterceptor } from './interceptors/league-authenticator.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './league/entities/match.entity';
import { PlayerSummary } from './league/entities/player-summary.entity';
import { NotFoundInterceptor } from './interceptors/not-found-interceptor';

@Module({
  imports: [
    LeagueModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Match, PlayerSummary],
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 5, // 5 minutes
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LeagueAuthenticatorInterceptor },
    { provide: APP_INTERCEPTOR, useClass: NotFoundInterceptor },
  ],
})
export class AppModule {}
