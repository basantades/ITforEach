import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  async resolve(route: ActivatedRouteSnapshot): Promise<User | null> {
    const session = await this.supabase.getSession();

    if (!session.data.session) {
      this.router.navigate(['/login']);
      return null;
    }

    const userMetadata = session.data.session.user.user_metadata as {
        user_name: string;
        full_name: string;
        avatar_url: string;
      };
      
      const user: User = {
        user_id: session.data.session.user.id,
        githubusername: userMetadata.user_name,
        fullname: userMetadata.full_name,
        avatarurl: userMetadata.avatar_url,
        email: session.data.session.user.email ?? '' // 🔥 Evita undefined
      };

    return user;
  }
}
