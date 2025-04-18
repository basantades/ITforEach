import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../services/database/projects.service';
import { DeleteProjectButtonComponent } from '../../ui/delete-project-button/delete-project-button.component';
import { RouterModule } from '@angular/router';
import { LikeCounterComponent } from "../../ui/like-counter/like-counter.component";
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-user-projects-list',
  templateUrl: './user-projects-list.component.html',
  styleUrls: ['./user-projects-list.component.scss'],
  imports: [DeleteProjectButtonComponent, RouterModule, LikeCounterComponent]
})
export class UserProjectsListComponent implements OnInit {

  userProjects: any[] = [];

  constructor(private projectsService: ProjectsService,
    public authService: AuthService) {}


  ngOnInit(): void {
    this.loadUserProjects();
  }
  loadUserProjects(): void {
    this.projectsService.getUserProjects().then(
      (projects) => {
        this.userProjects = projects
          .map(project => ({
            ...project,
            githubusername: project.githubusername || 'usuario-desconocido' // Fallback por si es null
          }))
          .sort((a, b) => {
            // Ordenar por updated_at (más reciente primero)
            const dateA = new Date(a.updated_at || '').getTime();
            const dateB = new Date(b.updated_at || '').getTime();
            return dateB - dateA; // Más reciente primero
          });
      }
    ).catch(
      (error) => {
        console.error('Error fetching user projects', error);
      }
    );
  }

  // Add this method to handle the projectDeleted event
  onProjectDeleted(projectId: number): void {
    // Actualiza la lista de proyectos eliminando el proyecto correspondiente
    this.userProjects = this.userProjects.filter(project => project.id !== projectId);
  }
}