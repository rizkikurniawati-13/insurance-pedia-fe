import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  private baseUrl = environment.apiUrl;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (state.url === '/login' || state.url === '/register') {
      return true;
    }

    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as string[] | undefined;

    return this.http.get<{ valid: boolean, roles?: string[] }>(`${this.baseUrl}/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => {
        if (!response.valid) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return false;
        }

        if (response.roles) {
          this.authService['roles'] = response.roles;
        }

        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        const userRoles = response.roles || [];
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
          this.router.navigate(['/forbidden']);
          return false;
        }

        return true;
      }),
      catchError(err => {
        console.error('AuthGuard: Error verifying token', err);
        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
        } else {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return of(false);
      })
    );
  }

    
}