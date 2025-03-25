import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private supabaseService: SupabaseService) {}

  async getGithubToken() {
    const { data: { session } } = await this.supabaseService.getSession();
    return session?.provider_token;
  }
  private async getGitHubToken(): Promise<string | null> {
    const { data: { session }, error } = await this.supabaseService.getSession();
    if (error || !session) {
      console.error('Failed to get Supabase session:', error);
      return null;
    }
  
    const token: string | null = session.provider_token ?? null;
    if (!token) console.warn('GitHub token not found in session');
    return token;
  }
  

  async getUserPublicRepos(): Promise<any[]> {
    const token = await this.getGitHubToken();
    if (!token) throw new Error('GitHub token not found');
  
    const response = await fetch('https://api.github.com/user/repos?visibility=public', {
      headers: {
        Authorization: `token ${token}`
      }
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error (repos):', errorData);
      throw new Error(`Failed to fetch repositories: ${errorData.message}`);
    }
  
    const repos = await response.json();
  
    // 🔥 Filtrar solo repos donde el usuario es administrador
    return repos.filter((repo: any) => repo.permissions?.admin === true);
  }

  async getGitHubUser(): Promise<any> {
    const token = await this.getGitHubToken();
    if (!token) throw new Error('GitHub token not found');

    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error (user):', errorData);
      throw new Error(`Failed to fetch GitHub user: ${errorData.message}`);
    }

    return await response.json();
  }
}
