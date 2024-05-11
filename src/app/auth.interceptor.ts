import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const userService = inject(AuthService)
  const authToken = userService.authToken;

  if (req.headers.get('Authorization')) {
    return next(req);
  }
  const authReq = req.clone({
    headers: req.headers.set('Authorization', authToken)
  });
  return next(authReq);
};