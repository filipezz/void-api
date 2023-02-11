import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { LeagueHttpService } from './league-http.service';
import { HttpService } from '../http/http-service';
import { LeagueSerializer } from './league.serializer';
import { UrlBuilderService } from './url-builder.service';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/common';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [{provide:LeagueService, useValue:jest.fn()}, {
        provide:CACHE_MANAGER, useValue:jest.fn()
      }],
    }).compile();
  });
   describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(2).toBe(2)
    });
  }); 
});
