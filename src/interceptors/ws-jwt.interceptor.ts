import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import * as process from 'process';

@Injectable()
export class WsJwtInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const socket = context.switchToWs().getClient();
    const authorizationHeader = socket.handshake.headers['authorization'];

    return new Observable((obs) => {
      const handleAuthorizationError = (errorMessage: string) => {
        socket.disconnect(true);
        obs.error(new Error(errorMessage));
        obs.complete();
      };

      if (!authorizationHeader) {
        handleAuthorizationError('Authorization header missing');
        return;
      }

      const [bearer, token] = authorizationHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        handleAuthorizationError('Invalid Authorization header format');
        return;
      }

      verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          handleAuthorizationError('Invalid token');
          return;
        }

        socket['user'] = decoded;

        next.handle().subscribe({
          next: (data) => {
            obs.next(data);
          },
          error: (err) => {
            obs.error(err);
          },
          complete: () => {
            obs.complete();
          },
        });
      });
    });
  }
}
