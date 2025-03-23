import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../../services/api/github.service';

@Component({
  selector: 'app-select-repo',
  imports: [],
  templateUrl: './select-repo.component.html',
  styleUrl: './select-repo.component.scss'
})

export class SelectRepoComponent implements OnInit {
  repos: any[] = [];
  selectedRepo: any = null;
  loading = false;
  error: string | null = null;

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.fetchRepos();
  }

  async fetchRepos(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      this.repos = await this.githubService.getUserPublicRepos();
    } catch (err: any) {
      this.error = err.message || 'Error al obtener los repositorios';
    } finally {
      this.loading = false;
    }
  }

  onRepoSelect(repo: any): void {
    this.selectedRepo = repo;
  }

  confirmSelection(): void {
    if (this.selectedRepo) {
      console.log('Repositorio seleccionado:', this.selectedRepo);
    }
  }
}
