import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../services/database/projects.service';
import { Project } from '../../../interfaces/project';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit {
  project: Project | null = null; // Proyecto a mostrar
  errorMessage: string | null = null; // Mensaje de error si no se encuentra el proyecto

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la ruta
    const username = this.route.snapshot.paramMap.get('githubUsername');
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