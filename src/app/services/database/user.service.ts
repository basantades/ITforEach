import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private supabaseService: SupabaseService) {}

  async getUserProfile(): Promise<User | null> {
    const { data: { user }, error } = await this.supabaseService.client.auth.getUser();
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
    };

    return mappedUser;
  }
}
