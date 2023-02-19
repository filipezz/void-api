import { Injectable, CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import axios from 'axios'
@Injectable()
export class LeagueAuthenticatorInterceptor implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        axios.defaults.headers["X-Riot-Token"] = process.env.RIOT_API_KEY
        return next.handle()
    }
}

