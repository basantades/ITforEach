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
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.scss'
})
export class DiscoverComponent implements OnInit {
  projectsService = inject(ProjectsService);
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];

  // Paginación
  page = 1;
  pageSize = 12;

  async ngOnInit() {
    await this.loadAllProjects();
  }

  async loadAllProjects() {
    try {
      this.allProjects = await this.projectsService.getAllProjects();
      this.filteredProjects = [...this.allProjects]; // Inicialmente, todos visibles
    } catch (error) {
      console.error('❌ Error cargando proyectos:', error);
    }
  }

  get paginatedProjects(): Project[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProjects.slice(start, end);
  }

  get totalProjects(): number {
    return this.filteredProjects.length;
  }

  nextPage() {
    if (this.page * this.pageSize < this.totalProjects) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  get pages(): number[] {
    const totalPages = Math.ceil(this.totalProjects / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onFiltered(filtered: Project[]) {
    this.filteredProjects = filtered;
    this.page = 1; // Reinicia la paginación al filtrar
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
