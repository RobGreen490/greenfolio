import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@services';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(err => {
      if(err.status === 401){
        return authService.refreshToken().pipe(
          switchMap(() => {
            return next(req); // retry original request
          })
        );
      }
       return throwError(() => err);
    })
  );
};
