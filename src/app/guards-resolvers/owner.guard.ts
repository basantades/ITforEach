import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.auth.userSignal();
    const routeUsername = route.params['githubusername'];
  
    const isOwner = user?.githubusername === routeUsername;
  
    if (!isOwner) {
      this.router.navigate(['/']);
    }
  
    return isOwner;
  }
  
}
