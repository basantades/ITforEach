import { Component, inject, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/database/projects.service';
import { Project } from '../../interfaces/project';
import { RouterModule } from '@angular/router';
import { ProjectCardComponent } from "../../components/blocks/project-card/project-card.component";
@Component({
  selector: 'app-discover',
  imports: [RouterModule, ProjectCardComponent],
  templateUrl: './discover.component.html'
})

export class DiscoverComponent implements OnInit {
  projectsService = inject(ProjectsService);
  projects: Project[] = [];
  page = 1;
  pageSize = 24;
  totalProjects = 0;

  async ngOnInit() {
    await this.loadProjects();
  }

  async loadProjects() {
    try {
      const { data, total } = await this.projectsService.getPaginated(this.page, this.pageSize);
      this.projects = data;
      this.totalProjects = total;
    } catch (error) {
      console.error('❌ Error cargando proyectos:', error);
    }
  }

  nextPage() {
    if (this.page * this.pageSize < this.totalProjects) {
      this.page++;
      this.loadProjects();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProjects();
    }
  }
}
