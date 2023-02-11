import { Injectable, CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import axios from 'axios'
@Injectable()
export class LeagueAuthenticatorInterceptor implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        axios.defaults.headers["X-Riot-Token"] = 'RGAPI-3a7fafa7-27ed-4b98-af16-92be37c0f988'
        
        return next.handle()
    }
}

