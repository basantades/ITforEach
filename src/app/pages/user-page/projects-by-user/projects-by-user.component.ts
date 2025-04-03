import { Component, Input, OnInit, signal } from '@angular/core';
import { ProjectsService } from '../../../services/database/projects.service';
import { Project } from '../../../interfaces/project';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-projects-by-user',
  imports: [ RouterModule, NgOptimizedImage ],
  templateUrl: './projects-by-user.component.html',
  styleUrl: './projects-by-user.component.scss'
})
export class ProjectsByUserComponent implements OnInit {
  @Input() githubusername!: string; // Recibir el username del usuario desde el componente padre
  projects: Project[] = []; // Almacenar los proyectos del usuario
  totalProjects = 0; // Total de proyectos
  page = 1; // Página actual
  pageSize = 24; // Tamaño de la página

  constructor(public projectsService: ProjectsService) {}

  async ngOnInit() {
    await this.loadProjectsByUser();
  }


  async loadProjectsByUser() {
    try {
      console.log('🔍 Cargando proyectos para:', this.githubusername); // Depuración
      const projects = await this.projectsService.getUserProjects(this.githubusername); // Asegúrate de que se use githubusername
      this.projects = projects;
      this.totalProjects = projects.length; // Actualizar el total de proyectos
    } catch (error) {
      console.error('❌ Error cargando proyectos del usuario:', error);
    }
  }

  nextPage() {
    if (this.page * this.pageSize < this.totalProjects) {
      this.page++;
      this.loadProjectsByUser();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProjectsByUser();
    }
  }
}