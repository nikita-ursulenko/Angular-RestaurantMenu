import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map((user) => {
        if (user && this.authService.isAdmin(user)) {
          console.log('Доступ к админ-панели разрешен');
          return true;
        } else {
          console.warn('Доступ к админ-панели запрещен');
          this.router.navigate(['/login']); // Перенаправление на login
          return false;
        }
      })
    );
  }
}