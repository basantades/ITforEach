import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectsService } from '../../../services/database/projects.service';
import { Project } from '../../../interfaces/project';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { LikeButtonComponent } from "../../ui/like-button/like-button.component";

@Component({
  selector: 'app-projects-by-user',
  imports: [RouterModule, NgOptimizedImage, LikeButtonComponent],
  templateUrl: './projects-by-user.component.html',
  styleUrl: './projects-by-user.component.scss'
})
export class ProjectsByUserComponent implements OnInit, OnChanges {
  @Input() githubusername!: string;
  projects: Project[] = [];

  constructor(public projectsService: ProjectsService) {}

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
    } catch (error) {
      console.error('❌ Error cargando proyectos del usuario:', error);
    }
  }
}
