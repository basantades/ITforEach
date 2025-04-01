import { Injectable } from '@angular/core';
import { Repo } from '../../interfaces/repo';
import { SupabaseService } from '../supabase/supabase.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../database/projects.service';



@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private supabaseService: SupabaseService,
    private router: Router,
    private toastr: ToastrService,
    private projectsService: ProjectsService ) {}

  /** Obtiene el token de GitHub desde la sesión activa en Supabase */
  private async getGitHubToken(): Promise<string | null> {
    const { data: { session } } = await this.supabaseService.getSession();
    return session?.provider_token ?? null;
  }

  /** Obtiene los repos públicos donde el usuario tiene permisos de admin */
  async getUserPublicRepos(): Promise<Repo[]> {
    const token = await this.getGitHubToken();
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
    await this.supabaseService.logout(); // 🔹 Cierra la sesión
    this.router.navigate(['/']); // 🔹 Redirigir a la home
  }
}
