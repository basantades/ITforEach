import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.auth.userSignal(); // Usuario autenticado actual
    const routeUsername = route.params['githubusername']; // Nombre de usuario en la URL

    if (user && user.githubusername === routeUsername) {
      return true; // Permitir acceso si es el propietario
    }

    // Redirigir si no es el propietario
    alert('No tienes permiso para acceder a esta página.');
    this.router.navigate(['/']);
    return false;
  }
}
