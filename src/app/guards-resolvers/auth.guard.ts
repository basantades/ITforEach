import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const session = await this.supabase.getSession();

    if (!session.data.session) {
      alert('Debes iniciar sesión para acceder a esta página.');
      // this.router.navigate(['/']); 
      return false;
    }

    return true; // 🔥 Usuario autenticado, permitir acceso
  }
}
