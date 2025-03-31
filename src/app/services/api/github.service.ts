import { Injectable } from '@angular/core';
import { Repo } from '../../interfaces/repo';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private supabaseService: SupabaseService) {}

  /** Obtiene el token de GitHub desde la sesión activa en Supabase */
  private async getGitHubToken(): Promise<string | null> {
    const { data: { session } } = await this.supabaseService.getSession();
    return session?.provider_token ?? null;
  }

  /** Obtiene los repos públicos donde el usuario tiene permisos de admin */
  async getUserPublicRepos(): Promise<Repo[]> {
    const token = await this.getGitHubToken();
    if (!token) throw new Error('GitHub token not found. Please log in again.');

    let allRepos: Repo[] = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await fetch(`https://api.github.com/user/repos?visibility=public&per_page=100&page=${page}`, {
          headers: { Authorization: `Bearer ${token}` } // 🔹 Cambiado de `token` a `Bearer`
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('GitHub API Error (repos):', errorData);

          if (response.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Try again later.');
          } else if (response.status === 401) {
            throw new Error('Invalid GitHub token. Please reauthenticate.');
          } else {
            throw new Error(`Failed to fetch repositories: ${errorData.message}`);
          }
        }

        const repos: Repo[] = await response.json();
        allRepos = [...allRepos, ...repos];

        if (repos.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }

      return allRepos.filter(repo => repo.permissions?.admin === true); // 🔹 Solo repos donde el usuario es admin
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }
}
