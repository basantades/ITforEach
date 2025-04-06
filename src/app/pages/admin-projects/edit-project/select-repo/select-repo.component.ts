import { Component, Signal, signal, Output, EventEmitter, inject } from '@angular/core';
import { GithubService } from '../../../../services/api/github.service';
import { Repo } from '../../../../interfaces/repo';

@Component({
  selector: 'app-select-repo',
  templateUrl: './select-repo.component.html',
  styleUrl: './select-repo.component.scss'
})
export class SelectRepoComponent {
  private githubService = inject(GithubService);

  repos = signal<Repo[]>([]);
  selectedRepo = signal<Repo | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  @Output() repoSelected = new EventEmitter<Repo>(); // 🔥 Emite el repo seleccionado al padre

  constructor() {
    this.fetchRepos();
  }

  async fetchRepos() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const repoList = await this.githubService.getUserPublicRepos();
      this.repos.set(repoList);
    } catch (err: any) {
      this.error.set(err.message || 'Error al obtener los repositorios');
    } finally {
      this.loading.set(false);
    }
  }

  onRepoSelect(repo: Repo) {
    this.selectedRepo.set(repo);
  }

  confirmSelection() {
    const repo = this.selectedRepo();
    if (repo) {
      this.repoSelected.emit(repo);
    }
  }
}
