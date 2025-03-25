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
  
      // 🔥 Obtener colaboradores usando solo el nombre del repo (sin owner)
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
  
  // 🔥 Modificamos `getRepoCollaborators()` para que solo reciba `repoName`
  async getRepoCollaborators(repoName: string): Promise<string[]> {
    const token = await this.getGitHubToken();
    if (!token) throw new Error('GitHub token not found');
  
    // 🔥 Asumimos que no hay colaboradores por defecto
    if (!repoName) {
      console.warn(`⚠️ Nombre de repositorio inválido para obtener colaboradores.`);
      return [];
    }
  
    try {
      const response = await fetch(`https://api.github.com/repos/user/${repoName}/collaborators`, {
        headers: {
          Authorization: `token ${token}`
        }
      });
  
      // 🔥 Si no hay colaboradores, devolvemos `[]` sin lanzar error
      if (!response.ok) {
        console.warn(`⚠️ No se encontraron colaboradores para ${repoName}.`);
        return [];
      }
  
      const collaborators = await response.json();
      return Array.isArray(collaborators) ? collaborators.map((collab: any) => collab.login) : [];
  
    } catch (error) {
      console.error(`❌ Error en la solicitud de colaboradores de ${repoName}:`, error);
      return [];
    }
  }
}
