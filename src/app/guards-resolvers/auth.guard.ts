import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../services/auth/supabase.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const session = await this.supabase.getSession();

    // Verificar si la sesión es nula
    if (!session) {
      alert('Debes iniciar sesión para acceder a esta página.');
      this.router.navigate(['/']); // Redirigir a la página de inicio
      return false;
    }

    return true; // Usuario autenticado, permitir acceso
  }
}
