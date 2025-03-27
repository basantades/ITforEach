import { Component, Signal, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repo } from '../../interfaces/repo';
import { Project } from '../../interfaces/project';
import { User } from '../../interfaces/user';
import { SelectRepoComponent } from "../../components/blocks/select-repo/select-repo.component";
import { CreateProjectComponent } from "../../components/sections/create-project/create-project.component";
import { UserProjectsComponent } from "./user-projects/user-projects.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SelectRepoComponent, CreateProjectComponent, UserProjectsComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user = signal<User | null>(null);
  showRepoSelector = signal(false);
  selectedRepo = signal<Repo | null>(null);

  constructor() {
    this.route.data.subscribe(({ user }) => {
      if (!user) {
        this.router.navigate(['/login']); // 🔥 Si no hay usuario, redirigir a login
        return;
      }
      this.user.set(user);

      // 🔥 Validar que la URL coincide con el usuario autenticado
      const githubUsernameFromUrl = this.route.snapshot.paramMap.get('githubUsername');
      if (user.githubUsername !== githubUsernameFromUrl) {
        this.router.navigate([`/${user.githubUsername}/projects`]); // 🔥 Redirige a la URL correcta
      }
    });
  }

  // 🔥 Computed Signal que garantiza que siempre haya un Project válido
  projectData = computed<Project>(() => {
    const repo = this.selectedRepo();
    const user = this.user();
  
    return {
      user_id: user?.id ?? '', // Si no hay usuario, dejamos un string vacío
      name: repo?.name ?? '',
      description: repo?.description ?? 'Sin descripción',
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

  toggleRepoSelector() {
    this.showRepoSelector.set(!this.showRepoSelector());
  }

  onRepoSelected(repo: Repo) {
    this.selectedRepo.set(repo);
    this.showRepoSelector.set(false); // 🔥 Ocultar selector cuando ya hay un repo seleccionado
  }
}
