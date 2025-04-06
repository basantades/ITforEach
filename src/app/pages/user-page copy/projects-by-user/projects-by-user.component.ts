import { Component, Input, OnInit } from '@angular/core';
import { ProjectsService } from '../../../services/database/projects.service';
import { Project } from '../../../interfaces/project';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { LikeButtonComponent } from "../../../components/ui/like-button/like-button.component";

@Component({
  selector: 'app-projects-by-user',
  imports: [RouterModule, NgOptimizedImage, LikeButtonComponent],
  templateUrl: './projects-by-user.component.html',
  styleUrl: './projects-by-user.component.scss'
})
export class ProjectsByUserComponent implements OnInit {
  @Input() githubusername!: string; // Recibir el username del usuario desde el componente padre
  projects: Project[] = []; // Almacenar los proyectos del usuario

  constructor(public projectsService: ProjectsService) {}

  async ngOnInit() {
    await this.loadProjectsByUser();
  }

  async loadProjectsByUser() {
    try {
      const projects = await this.projectsService.getUserProjects(this.githubusername); // Asegúrate de que se use githubusername
      this.projects = projects;
    } catch (error) {
      console.error('❌ Error cargando proyectos del usuario:', error);
    }
  }
}