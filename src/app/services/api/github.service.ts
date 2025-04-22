import { Injectable } from '@angular/core';
import { Repo } from '../../interfaces/repo';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ProjectsService } from '../database/projects.service';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
    private projectsService: ProjectsService
  ) {}

  /** Obtiene los repos públicos donde el usuario tiene permisos de admin */
  async getUserPublicRepos(): Promise<Repo[]> {
    const token = this.authService.getGitHubToken();
    if (!token) {
      await this.handleAuthError('GitHub token not found. Please log in again.');
      return [];
    }

    try {
      // 🔹 Obtener los proyectos del usuario
      const userProjects = await this.projectsService.getUserProjects();

      let allRepos: Repo[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`https://api.github.com/user/repos?visibility=public&per_page=100&page=${page}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 403) {
            this.notification.logAndThrow(errorData, 'GitHub API rate limit exceeded. Try again later.');
          } else if (response.status === 401) {
            await this.handleAuthError('Invalid GitHub token. Please reauthenticate.');
            return [];
          } else {
            this.notification.logAndThrow(errorData, `Failed to fetch repositories: ${errorData.message}`);
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

      // 🔹 Filtrar repos que ya existen en `projects`
      return allRepos.filter(repo =>
        repo.permissions?.admin === true &&
        !userProjects.some(project => project.repository_url === repo.html_url) // ❌ No incluir repos ya usados
      );
      
    } catch (error) {
      this.notification.logAndThrow(error, 'Error fetching repositories');
      throw error;
    }
    
  }

  /** Maneja errores de autenticación y redirige a la home */
  private async handleAuthError(message: string): Promise<void> {
    this.notification.showError(message, 'Error de autenticación');
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  /** Obtiene la información completa de un repositorio a partir de su URL */
async getRepoInfo(repoUrl: string): Promise<{
  name: string;
  description: string;
  homepage: string;
  topics: string[];
  languages: string[];
  updated_at: string;
}> {
  const token = this.authService.getGitHubToken();
  if (!token) {
    await this.handleAuthError('GitHub token not found. Please log in again.');
    throw new Error('GitHub token is missing');
  }

  // Extraer owner y repo desde la URL
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    this.notification.showError('URL del repositorio inválida.');
    throw new Error('Invalid GitHub repository URL');
  }

  const owner = match[1];
  const repo = match[2];

  try {
    // Obtener datos básicos del repositorio
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!repoRes.ok) {
      this.notification.showError('Error obteniendo info del repositorio.');
      throw new Error('Error fetching repo info');
    }
    const repoData = await repoRes.json();

    // Obtener topics
    const topicsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/topics`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.mercy-preview+json'
      }
    });
    const topicsData = await topicsRes.json();

    // Obtener lenguajes
    const languagesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const languagesData = await languagesRes.json();

    return {
      name: repoData.name,
      description: repoData.description || '',
      homepage: repoData.homepage || '',
      topics: topicsData.names || [],
      languages: Object.keys(languagesData),
      updated_at: repoData.updated_at
    };

  } catch (error) {
    this.notification.logAndThrow(error, 'Error fetching repo info');
    throw error;
  }
}

}