import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../../services/database/projects.service';
import { Project } from '../../../interfaces/project';
import {  OnInit } from '@angular/core';
import { MoreProjectsButtonComponent } from "../../ui/more-projects-button/more-projects-button.component";
import { ProjectCardComponent } from "../../blocks/project-card/project-card.component";

@Component({
  selector: 'app-latest-projects',
  standalone: true,
  imports: [CommonModule, MoreProjectsButtonComponent, ProjectCardComponent],
  templateUrl: './latest-projects.component.html'
})
export class LatestProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);
  
  
  limit = 4;

  constructor(public projectsService: ProjectsService) {}

  ngOnInit() {
    this.setLimitBasedOnWidth();
    window.addEventListener('resize', this.setLimitBasedOnWidth.bind(this));
    this.fetchProjects();
  }

  private setLimitBasedOnWidth() {
    const width = window.innerWidth;
    if (width < 768) this.limit = 2;
    else if (width < 1280) this.limit = 3;
    else this.limit = 4;
  }

  private async fetchProjects() {
    const result = await this.projectsService.getLatestProjects(this.limit);
    this.projects.set(result);
  }
}
