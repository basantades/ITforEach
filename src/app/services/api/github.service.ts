import { Injectable } from '@angular/core';
import { Repo } from '../../interfaces/repo';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../database/projects.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private projectsService: ProjectsService
  ) {}

  /** Obtiene los repos públicos donde el usuario tiene permisos de admin */
  async getUserPublicRepos(): Promise<Repo[]> {
    const token = this.authService.getGitHubToken();
    if (!token) {
      this.handleAuthError('GitHub token not found. Please log in again.');
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
          console.error('GitHub API Error (repos):', errorData);

          if (response.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Try again later.');
          } else if (response.status === 401) {
            this.handleAuthError('Invalid GitHub token. Please reauthenticate.');
            return [];
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

      // 🔹 Filtrar repos que ya existen en `projects`
      return allRepos.filter(repo =>
        repo.permissions?.admin === true &&
        !userProjects.some(project => project.repository_url === repo.html_url) // ❌ No incluir repos ya usados
      );
      
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  /** Maneja errores de autenticación y redirige a la home */
  private async handleAuthError(message: string): Promise<void> {
    this.toastr.error(message, 'Error de autenticación');
    await this.authService.logout(); // 🔹 Cierra la sesión
    this.router.navigate(['/']); // 🔹 Redirigir a la home
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
    this.handleAuthError('GitHub token not found. Please log in again.');
    throw new Error('GitHub token is missing');
  }

  // Extraer owner y repo desde la URL
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  const owner = match[1];
  const repo = match[2];

  try {
    // Obtener datos básicos del repositorio
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!repoRes.ok) throw new Error('Error fetching repo info');
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
    console.error('Error fetching repo info:', error);
    throw error;
  }
}

}