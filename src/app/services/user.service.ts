import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async getUserProfile(): Promise<User | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error || !user) {
      console.error('Error fetching user:', error);
      return null;
    }

    const metadata = user.user_metadata || {};

    const mappedUser: User = {
      id: user.id,
      githubUsername: metadata["user_name"] || '',
      fullName: metadata["full_name"] || '',
      avatarUrl: metadata["avatar_url"] || '',
      email: user.email || '',
      // bio, website, etc., se completan luego si tienes un perfil extendido
    };

    return mappedUser;
  }
}
