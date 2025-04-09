import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../interfaces/project';
import { ProjectsService } from '../../services/database/projects.service';
import { GithubService } from '../../services/api/github.service';
import { ProjectFormComponent } from "../../components/sections/project-form/project-form.component";
import { GithubProjectInfoComponent } from "../../components/sections/github-project-info/github-project-info.component";

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ProjectFormComponent, GithubProjectInfoComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectsService = inject(ProjectsService);
  private githubService = inject(GithubService);

  project = signal<Project | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    const githubusername = this.route.snapshot.paramMap.get('githubusername');
    const projectName = this.route.snapshot.paramMap.get('projectName');

    if (!githubusername || !projectName) {
      this.error.set('Ruta inválida. Falta githubusername o projectName.');
      return;
    }

    try {
      const dbProject = await this.projectsService.getByUsernameAndProjectName(githubusername, projectName);
      if (!dbProject) throw new Error('Proyecto no encontrado');

      const repoApiUrl = dbProject.repository_url!.replace('github.com', 'api.github.com/repos');

      const [repoData, languages] = await Promise.all([
        fetch(repoApiUrl).then(res => res.json()),
        fetch(`${repoApiUrl}/languages`).then(res => res.json()),
      ]);

      this.project.set({
        ...dbProject,
        name: repoData.name,
        description: repoData.description,
        homepage_url: repoData.homepage,
        topics: repoData.topics,
        languages: languages,
        github_updated_at: repoData.updated_at,
      });

    } catch (e: any) {
      this.error.set(e.message || 'Error cargando proyecto');
    } finally {
      this.loading.set(false);
    }
  }

  async onProjectUpdated() {
    const githubusername = this.project()?.githubusername;
    const projectName = this.project()?.name;
    if (!githubusername || !projectName) return;

    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
    this.router.navigate([`/${githubusername}/${projectName}`]);
  }
}
