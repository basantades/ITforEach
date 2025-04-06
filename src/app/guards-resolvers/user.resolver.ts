import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SupabaseService } from '../services/auth/supabase.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

 async resolve(route: ActivatedRouteSnapshot): Promise<User | null> {
      const session = await this.supabase.getSession();

    // Verificar si la sesión es nula
    if (!session) {
      this.router.navigate(['/']);
      return null;
    }

    // Extraer los metadatos del usuario desde la sesión
    const userMetadata = session.user.user_metadata as {
      user_name: string;
      full_name: string;
      avatar_url: string;
    };

    // Construir el objeto User
    const user: User = {
      user_id: session.user.id,
      githubusername: userMetadata.user_name,
      fullname: userMetadata.full_name,
      avatarurl: userMetadata.avatar_url,
    };

    return user;
  }
}