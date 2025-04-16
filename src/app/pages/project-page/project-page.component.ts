import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../services/database/projects.service';
import { Project } from '../../interfaces/project';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { UserAvatarComponent } from '../../components/ui/user-avatar/user-avatar.component';
import { LikeButtonComponent } from '../../components/ui/like-button/like-button.component';
import { AuthService } from '../../services/auth/auth.service';
import { GithubLinkButtonComponent } from "../../components/ui/github-link-button/github-link-button.component";
import { WebsiteLinkButtonComponent } from "../../components/ui/website-link-button/website-link-button.component";
import { LoadingComponent } from "../../components/ui/loading/loading.component";

@Component({
  selector: 'app-project-page',
  imports: [RouterLink, NgOptimizedImage, UserAvatarComponent, LikeButtonComponent, GithubLinkButtonComponent, WebsiteLinkButtonComponent, LoadingComponent],
  templateUrl: './project-page.component.html'
})
export class ProjectInfoComponent implements OnInit {
  project: Project | null = null; 
  errorMessage: string | null = null; 
  public authService = inject(AuthService);
  user = this.authService.userSignal;
  isOwner(): boolean {
    const currentUser = this.user();
    return !!currentUser && this.project?.githubusername === currentUser.githubusername;
  }

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la ruta
    const username = this.route.snapshot.paramMap.get('githubusername');
    const projectName = this.route.snapshot.paramMap.get('projectName');

    if (username && projectName) {
      this.loadProject(username, projectName);
    } else {
      this.errorMessage = 'No se proporcionaron los datos necesarios.';
    }
  }

  loadProject(username: string, projectName: string): void {
    this.projectsService.getByUsernameAndProjectName(username, projectName).then(
      (project) => {
        if (project) {
          this.project = project;
        } else {
          this.errorMessage = 'Proyecto no encontrado.';
        }
      }
    ).catch((error) => {
      console.error('Error al cargar el proyecto:', error);
      this.errorMessage = 'Ocurrió un error al cargar el proyecto.';
    });
  }
  objectKeys(obj: Record<string, any> | null | undefined): string[] {
    return obj ? Object.keys(obj) : [];
  }



  
  
}