import { Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProjectsService } from '../../../services/database/projects.service';
import { Project } from '../../../interfaces/project';
import { Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAvatarComponent } from "../../ui/user-avatar/user-avatar.component";
import { LikeButtonComponent } from "../../ui/like-button/like-button.component";

@Component({
  selector: 'app-latest-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, UserAvatarComponent, LikeButtonComponent],
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
