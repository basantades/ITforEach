import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SupabaseService } from '../services/auth/supabase.service';
import { User } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class PublicUserResolver implements Resolve<User | null> {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  async resolve(route: ActivatedRouteSnapshot): Promise<User | null> {
    const githubusername = route.paramMap.get('githubusername');

    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('githubusername', githubusername)
      .single();

    if (error || !data) {
      this.router.navigate(['/404']);
      return null;
    }

    return data as User;
  }
}
