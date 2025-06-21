import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService, private router: Router) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = this.authService.getToken();

//     let clonedReq = req;
//     if (token) {
//       clonedReq = req.clone({
//         headers: req.headers.set('Authorization', `Bearer ${token}`)
//       });
//     }

//     return next.handle(clonedReq).pipe(
//       catchError(err => {
//         if (err.status === 401) {
//           this.authService.logout();
//           this.router.navigate(['/login']);
//         }
//         return throwError(err);
//       })
//     );
//   }
// }


console.log('AuthInterceptor: File loaded');

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  console.log(`AuthInterceptor: Intercepting URL=${req.url}`);
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  console.log(`AuthInterceptor: Token=${token ? token.substring(0, 20) + '...' : 'null'}`);

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('AuthInterceptor: Added Authorization header');
  } else {
    console.log('AuthInterceptor: No token, skipping header');
  }

  return next(clonedReq).pipe(
    catchError(err => {
      console.error(`AuthInterceptor: Error URL=${req.url}, Status=${err.status}, Message=${err.message}`);
      if (err.status === 401) {
        console.log('AuthInterceptor: 401 Unauthorized, redirecting to /login');
        authService.logout();
        router.navigate(['/login']);
      } else if (err.status === 403) {
        console.log('AuthInterceptor: 403 Forbidden');
      }
      return throwError(() => err);
    })
  );
};
