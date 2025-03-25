import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const session = await this.supabase.getSession();

    if (!session.data.session) {
      // 🔥 Si no hay sesión, redirigir a login
      this.router.navigate(['/login']);
      return false;
    }

    return true; // 🔥 Usuario autenticado, permitir acceso
  }
}
