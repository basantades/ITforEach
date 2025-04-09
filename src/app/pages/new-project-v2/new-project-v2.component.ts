import { Component, computed, signal, Signal, inject } from '@angular/core';
import { ProjectFormComponent } from '../../components/sections/project-form/project-form.component';
import { SelectRepoComponent } from '../../components/blocks/select-repo/select-repo.component';
import { Repo } from '../../interfaces/repo';
import { Project } from '../../interfaces/project';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { GithubProjectInfoComponent } from '../../components/sections/github-project-info/github-project-info.component';

@Component({
  selector: 'app-new-project-v2',
  standalone: true,
  imports: [
    SelectRepoComponent,
    ProjectFormComponent,
    GithubProjectInfoComponent
  ],
  templateUrl: './new-project-v2.component.html',
})
export class NewProjectV2Component {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.userSignal;
  selectedRepo = signal<Repo | null>(null);

  constructor() {
    if (!this.user()) {
      this.router.navigate(['/login']);
    }
  }

  // Usamos el mismo nombre que tenías en el HTML
  project: Signal<Project> = computed(() => {
    const repo = this.selectedRepo();
    const user = this.user();

    return {
      user_id: user?.user_id ?? '',
      githubusername: user?.githubusername ?? '',
      name: repo?.name ?? '',
      description: repo?.description ?? '',
      repository_url: repo?.html_url ?? '',
      homepage_url: repo?.homepage ?? '',
      topics: repo?.topics ?? [],
      languages: repo?.languages ?? {},
      github_updated_at: repo?.updated_at ?? '',
      status: 'undefined',
      about_project: '',
      main_image_url: '',
      extra_images_urls: [],
    };
  });

  onRepoSelected(repo: Repo) {
    this.selectedRepo.set(repo);
  }

  onProjectCreated() {
    this.selectedRepo.set(null);
  }
}
