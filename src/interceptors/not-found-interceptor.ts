import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (!(error instanceof AxiosError)) {
          throw new HttpException(
            {
              status_code: 400,
              message: error.message,
              source: 'api',
            },
            400,
          );
        } else {
          throw new HttpException(
            {
              status_code: error.response.status,
              message: error.message,
              source: 'riot',
            },
            error.response.status,
          );
        }
      }),
    );
  }
}
