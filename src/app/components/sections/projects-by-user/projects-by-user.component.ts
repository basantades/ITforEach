import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from '../../../services/database/projects.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Project } from '../../../interfaces/project';
import { RouterModule } from '@angular/router';
import { ProjectCardOwnerComponent } from "../../blocks/project-card-owner/project-card-owner.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-by-user',
  imports: [RouterModule, ProjectCardOwnerComponent, CommonModule ],
  templateUrl: './projects-by-user.component.html'
})
export class ProjectsByUserComponent implements OnInit, OnChanges {
  @Input() githubusername!: string;
  projects: Project[] = [];
  @Output() projectCount = new EventEmitter<number>();


  constructor(
        public authService: AuthService,
    public projectsService: ProjectsService) {}

  async ngOnInit() {
    await this.loadProjectsByUser();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['githubusername'] && !changes['githubusername'].firstChange) {
      await this.loadProjectsByUser(); // 🔁 Vuelve a cargar si cambia el username
    }
  }

  async loadProjectsByUser() {
    try {
      const projects = await this.projectsService.getUserProjects(this.githubusername);
      this.projects = projects;
      this.projectCount.emit(this.projects.length);
    } catch (error) {
      console.error('❌ Error cargando proyectos del usuario:', error);
    }
  }
}
