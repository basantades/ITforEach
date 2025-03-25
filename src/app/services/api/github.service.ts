import { Injectable } from '@angular/core';
import { Repo } from '../../interfaces/repo';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private supabaseService: SupabaseService) {}

  private async getGitHubToken(): Promise<string | null> {
    const { data: { session } } = await this.supabaseService.getSession();
    return session?.provider_token ?? null;
  }

  async getUserPublicRepos(): Promise<Repo[]> {
    const token = await this.getGitHubToken();
    if (!token) throw new Error('GitHub token not found');

    let allRepos: Repo[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`https://api.github.com/user/repos?visibility=public&per_page=100&page=${page}`, {
        headers: { Authorization: `token ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('GitHub API Error (repos):', errorData);
        throw new Error(`Failed to fetch repositories: ${errorData.message}`);
      }

      const repos: Repo[] = await response.json();

      // 🔥 Obtener colaboradores usando solo el nombre del repo
      for (const repo of repos) {
        repo.collaborators = await this.getRepoCollaborators(repo.name);
      }

      allRepos = [...allRepos, ...repos];

      if (repos.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allRepos.filter(repo => repo.permissions?.admin === true);
  }

  async getRepoCollaborators(repo: string): Promise<string[]> {
    const token = await this.getGitHubToken();
    if (!token) throw new Error('GitHub token not found');

    const url = `https://api.github.com/repos/${repo}/collaborators`;

    const response = await fetch(url, {
      headers: { Authorization: `token ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error (collaborators):', errorData);
      throw new Error(`Failed to fetch collaborators: ${errorData.message}`);
    }

    const collaborators = await response.json();
    return collaborators.map((collab: any) => collab.login);
  }
}
