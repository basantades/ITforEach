import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class GithubUserService {
  constructor(private supabaseService: SupabaseService) {}

  private async getGitHubToken(): Promise<string | null> {
    const { data: { session } } = await this.supabaseService.getSession();
    return session?.provider_token ?? null;
  }

  async getGitHubUser(): Promise<any> {
    const token = await this.getGitHubToken();
    if (!token) throw new Error('GitHub token not found');

    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error (user):', errorData);
      throw new Error(`Failed to fetch GitHub user: ${errorData.message}`);
    }

    const userData = await response.json();
    console.log('GitHub User Data:', userData); // 🔍 Mostrar los datos obtenidos
    return userData;  }
}
