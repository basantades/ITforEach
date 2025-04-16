import { Component, inject, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/database/projects.service';
import { Project } from '../../interfaces/project';
import { RouterModule } from '@angular/router';
import { ProjectCardComponent } from "../../components/blocks/project-card/project-card.component";
import { CommonModule } from '@angular/common';
import { ProjectFilterComponent } from "../../components/blocks/project-filter/project-filter.component";
@Component({
  selector: 'app-discover',
  imports: [RouterModule, ProjectCardComponent, CommonModule, ProjectFilterComponent],
  templateUrl: './discover.component.html'
})

export class DiscoverComponent implements OnInit {
  projectsService = inject(ProjectsService);
  projects: Project[] = [];
  page = 1;
  pageSize = 12;
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
  get pages(): number[] {
    const totalPages = Math.ceil(this.totalProjects / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  filteredProjects: Project[] | null = null;

  onFiltered(filtered: Project[]) {
    this.filteredProjects = filtered;
  }
  

}
