import { CacheModule, Module } from '@nestjs/common';
import { LeagueModule } from './league/league.module';
import { LeagueAuthenticatorInterceptor } from './interceptors/league-authenticator.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './league/entities/match.entity';

@Module({
  imports: [
    LeagueModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Match],
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal:true,
      ttl: 60 * 5, // 5 minutes
    })
  ],
  controllers: [],
  providers: [
    
    { provide: APP_INTERCEPTOR, useClass: LeagueAuthenticatorInterceptor },
    
  ],
})
export class AppModule {}
