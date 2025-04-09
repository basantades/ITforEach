import { Component, Signal, signal, computed, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repo } from '../../interfaces/repo';
import { Project } from '../../interfaces/project';
import { User } from '../../interfaces/user';
import { SelectRepoComponent } from '../../components/blocks/select-repo/select-repo.component';
import { CreateProjectComponent } from './create-project/create-project.component';



@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [SelectRepoComponent, CreateProjectComponent],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user = signal<User | null>(null);
  showRepoSelector = signal(false);
  selectedRepo = signal<Repo | null>(null);

  constructor() {
    this.route.data.subscribe(({ user }) => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.user.set(user);

      const githubusernameFromUrl = this.route.snapshot.paramMap.get('githubusername');
      if (user.githubusername !== githubusernameFromUrl) {
        this.router.navigate([`/${user.githubusername}/projects`]);
      }
    });
  }

  // Computed Signal que garantiza un Project válido
  projectData = computed<Project>(() => {
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
      extra_images_urls: []
    };
  });

  onRepoSelected(repo: Repo) {
    this.selectedRepo.set(repo);
  }

  onProjectCreated() {
  
    this.selectedRepo.set(null);
  
  }
  
}
