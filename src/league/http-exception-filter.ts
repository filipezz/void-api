import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'; 
import { Request, Response } from 'express'; 
import { AxiosError } from 'axios';

@Catch(AxiosError) 
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: AxiosError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
        
      response.status(exception.response.status).json(exception.response.data);
    }
  }